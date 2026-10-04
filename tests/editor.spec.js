const { test: base, expect } = require("@playwright/test");
const path = require("node:path");
const fs = require("node:fs/promises");

// Exercise the real renderer and fonts, with no dependence on CDN availability.
const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin === "http://127.0.0.1:4173") return route.continue();
      const match = url.href.match(/^https:\/\/cdn\.jsdelivr\.net\/npm\/(katex@0\.19\.0|html2canvas@1\.4\.1)\/dist\/([a-zA-Z0-9_./-]+)$/);
      if (!match || match[2].includes("..")) {
        errors.push("Unexpected external request: " + url.href);
        return route.abort();
      }
      const packageName = match[1].split("@")[0];
      await route.fulfill({
        path: path.resolve(__dirname, "../node_modules", packageName, "dist", match[2]),
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    });
    await use(page);
    expect(errors, "No uncaught errors or external network dependencies").toEqual([]);
  }
});

async function openApp(page) {
  await page.goto("/");
  if (await page.locator("html").getAttribute("lang") !== "en") {
    await page.locator("#btn-lang").click();
  }
}

async function selectAllInput(page) {
  await page.locator("#latex-input").evaluate(input => {
    input.focus();
    input.setSelectionRange(0, input.value.length);
  });
}

async function mockClipboard(page) {
  await page.evaluate(() => {
    window.copiedTexts = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText(text) {
          window.copiedTexts.push(text);
          return Promise.resolve();
        }
      }
    });
  });
}

test("restores a rendered draft, removes it on Clear, and restores Clear through native undo", async ({ page }) => {
  await openApp(page);
  const input = page.locator("#latex-input");
  const latex = "\\frac{a+b}{2}";
  await input.fill(latex);
  await expect(page.locator("#draft-status")).toHaveText("Draft saved in this browser");
  await page.reload();
  await expect(input).toHaveValue(latex);
  await expect(page.locator("#draft-status")).toHaveText("Previous draft restored");
  await expect(page.locator("#katex-output .katex")).toBeVisible();

  await page.locator("#btn-clear").click();
  await expect(input).toHaveValue("");
  expect(await page.evaluate(() => localStorage.getItem("mathEditorDraft"))).toBeNull();
  await input.press("ControlOrMeta+z");
  await expect(input).toHaveValue(latex);
  expect(await page.evaluate(() => localStorage.getItem("mathEditorDraft"))).toBe(latex);
  await page.locator("#btn-clear").click();
  await page.reload();
  await expect(input).toHaveValue("");
  await expect(page.locator("#katex-output .placeholder")).toBeVisible();
});

for (const storageFailure of ["denied", "quota"]) {
  test(`continues editing and switching languages with ${storageFailure} storage`, async ({ page }) => {
    await page.addInitScript(failure => {
      if (failure === "denied") {
        Object.defineProperty(window, "localStorage", {
          get() { throw new DOMException("Storage denied", "SecurityError"); }
        });
      } else {
        Storage.prototype.setItem = function () {
          throw new DOMException("Storage full", "QuotaExceededError");
        };
      }
    }, storageFailure);
    await openApp(page);
    await page.locator("#latex-input").fill("x^2");
    await expect(page.locator("#katex-output .katex")).toBeVisible();
    await expect(page.locator("#draft-status")).toHaveText("Autosave is unavailable. Copy or save any formulas you need.");
    await page.locator("#btn-lang").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.locator("#latex-input")).toHaveValue("x^2");
    await expect(page.locator("#katex-output .katex")).toBeVisible();
  });
}

test("wraps a selection in a fraction and brackets, and places an empty bracket caret correctly", async ({ page }) => {
  await openApp(page);
  const input = page.locator("#latex-input");
  await input.fill("a+b");
  await selectAllInput(page);
  await page.locator('[data-target="structures"]').click();
  await page.locator("#panel-structures").getByRole("button", { name: "a/b", exact: true }).click();
  await expect(input).toHaveValue("\\frac{a+b}{}");
  await selectAllInput(page);
  await page.locator('[data-target="brackets"]').click();
  await page.locator("#panel-brackets").getByRole("button", { name: "( )", exact: true }).click();
  expect(await input.inputValue()).toMatch(/^\\left\(\s*\\frac\{a\+b\}\{\}\s*\\right\)$/);
  await page.locator("#btn-clear").click();
  await page.locator("#panel-brackets").getByRole("button", { name: "⟨ ⟩", exact: true }).click();
  await input.pressSequentially("x");
  expect(await input.inputValue()).toMatch(/^\\left\\langle\s*x\s*\\right\\rangle$/);
  await expect(page.locator("#katex-output .katex")).toBeVisible();
  await expect(page.locator("#error-output")).not.toBeVisible();
});

for (const fallback of [false, true]) {
  test(`toolbar insertion emits one input event with ${fallback ? "fallback" : "native"} insertion`, async ({ page }) => {
    await openApp(page);
    await page.evaluate(useFallback => {
      window.inputEvents = 0;
      document.getElementById("latex-input").addEventListener("input", () => window.inputEvents++);
      if (useFallback) document.execCommand = () => false;
    }, fallback);
    await page.locator("#panel-greek").getByRole("button", { name: "α", exact: true }).click();
    await expect(page.locator("#latex-input")).toHaveValue("\\alpha");
    expect(await page.evaluate(() => window.inputEvents)).toBe(1);
    expect(await page.evaluate(() => localStorage.getItem("mathEditorDraft"))).toBe("\\alpha");
  });
}

test("renders real accessible math and blocks trusted HTML commands in both render paths", async ({ page }) => {
  await openApp(page);
  for (const expression of [
    "\\frac{x^2}{2}+\\sqrt{y}",
    "\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}",
    "\\textcolor{red}{x}+\\cancel{y}",
    "\\begin{aligned}a &= b+c \\\\ d &= e\\end{aligned}"
  ]) {
    await page.locator("#latex-input").fill(expression);
    expect(await page.evaluate(() => MathEditor.preview.render())).toBe(true);
    await expect(page.locator("#katex-output math")).toHaveAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
    await expect(page.locator("#katex-output .katex-html")).toBeVisible();
  }
  for (const expression of ["\\href{https://example.com}{x}", "\\href{https://example.com}{x}+\\invalidcommand"]) {
    await page.locator("#latex-input").fill(expression);
    await page.evaluate(() => MathEditor.preview.render());
    await expect(page.locator("#katex-output a")).toHaveCount(0);
  }
});

test("MathML copy flushes the preview debounce and includes current XML", async ({ page }) => {
  await openApp(page);
  await mockClipboard(page);
  await page.locator("#latex-input").fill("old");
  await page.evaluate(() => MathEditor.preview.render());
  await page.evaluate(() => {
    MathEditor.editor.setValue("\\frac{new}{2}");
    document.getElementById("btn-copy-mathml").click();
  });
  await expect(page.locator("#toast")).toHaveText("MathML copied to clipboard");
  const result = await page.evaluate(() => {
    const text = window.copiedTexts[0];
    const xml = new DOMParser().parseFromString(text, "application/xml");
    return { text, error: Boolean(xml.querySelector("parsererror")), root: xml.documentElement.localName, namespace: xml.documentElement.namespaceURI };
  });
  expect(result.error).toBe(false);
  expect(result.root).toBe("math");
  expect(result.namespace).toBe("http://www.w3.org/1998/Math/MathML");
  expect(result.text).toContain("\\frac{new}{2}");
  expect(result.text).not.toContain("old");
});

test("MathML with text spaces remains valid standalone XML", async ({ page }) => {
  await openApp(page);
  await mockClipboard(page);
  for (const latex of ["\\text{a b}", "a\\ b", "\\text{a~b}"]) {
    await page.locator("#latex-input").fill(latex);
    const result = await page.evaluate(async () => {
      await MathEditor.actions.copyMathML();
      const text = window.copiedTexts.at(-1);
      const xml = new DOMParser().parseFromString(text, "application/xml");
      return {
        error: Boolean(xml.querySelector("parsererror")),
        namespace: xml.documentElement.namespaceURI,
        source: xml.querySelector("annotation")?.textContent,
        text: xml.documentElement.textContent
      };
    });
    expect(result.error).toBe(false);
    expect(result.namespace).toBe("http://www.w3.org/1998/Math/MathML");
    expect(result.source).toBe(latex);
    expect(result.text).toContain("\u00a0");
  }
});

test("empty or invalid input cannot export stale MathML or images", async ({ page }) => {
  await openApp(page);
  await mockClipboard(page);
  await page.evaluate(() => {
    window.captures = 0;
    window.html2canvas = () => { window.captures++; return Promise.reject(new Error("Unexpected capture")); };
  });
  for (const latex of ["", "\\invalidcommand"]) {
    await page.evaluate(value => {
      MathEditor.editor.setValue("previous");
      MathEditor.preview.render();
      MathEditor.editor.setValue(value);
      document.getElementById("btn-copy-mathml").click();
      document.getElementById("btn-save-image").click();
      document.getElementById("btn-copy-image").click();
    }, latex);
    await expect(page.locator("#toast")).toHaveText("No valid formula to export. Check your input.");
  }
  expect(await page.evaluate(() => ({ text: window.copiedTexts.length, image: window.captures }))).toEqual({ text: 0, image: 0 });
});

test("failed legacy clipboard copy reports failure and preserves the editor selection", async ({ page }) => {
  await openApp(page);
  await page.locator("#latex-input").fill("x+y");
  await selectAllInput(page);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    document.execCommand = () => false;
    document.getElementById("btn-copy").click();
  });
  await expect(page.locator("#toast")).toHaveText("Failed to copy");
  await expect(page.locator("textarea")).toHaveCount(1);
  expect(await page.locator("#latex-input").evaluate(input => [input.selectionStart, input.selectionEnd])).toEqual([0, 3]);
});

test("image copy writes a promise within the click and captures the latest immutable formula", async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => {
    window.captureCalls = [];
    window.clipboardWrites = [];
    window.ClipboardItem = class {
      constructor(data) { this.data = data; }
    };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        write(items) {
          const png = items[0].data["image/png"];
          window.clipboardWrites.push({ duringClick: window.duringClick, isPromise: png instanceof Promise });
          return Promise.resolve(png).then(blob => { window.copiedImageType = blob.type; });
        }
      }
    });
    window.html2canvas = async (element, options) => {
      window.captureCalls.push({
        isPreview: element === document.getElementById("katex-output"),
        text: element.textContent,
        options
      });
      return { toBlob: callback => callback(new Blob(["image"], { type: "image/png" })) };
    };
    MathEditor.editor.setValue("old");
    MathEditor.preview.render();
    MathEditor.editor.setValue("latest");
    window.duringClick = true;
    document.getElementById("btn-copy-image").click();
    window.duringClick = false;
    MathEditor.editor.setValue("changed-after-click");
    MathEditor.preview.render();
  });
  await expect(page.locator("#toast")).toHaveText("Image copied to clipboard");
  const result = await page.evaluate(() => ({ writes: window.clipboardWrites, captures: window.captureCalls, type: window.copiedImageType }));
  expect(result.writes).toEqual([{ duringClick: true, isPromise: true }]);
  expect(result.captures).toHaveLength(1);
  expect(result.captures[0].isPreview).toBe(false);
  expect(result.captures[0].text).toContain("latest");
  expect(result.captures[0].text).not.toContain("changed-after-click");
  expect(result.type).toBe("image/png");
  await expect(page.locator(".katex-html")).toHaveCount(1);
});

for (const failure of ["null blob", "capture rejected"]) {
  test(`image save reports ${failure} without downloading`, async ({ page }) => {
    await openApp(page);
    let downloads = 0;
    page.on("download", () => downloads++);
    await page.locator("#latex-input").fill("x");
    await page.evaluate(kind => {
      window.html2canvas = () => kind === "null blob"
        ? Promise.resolve({ toBlob: callback => callback(null) })
        : Promise.reject(new Error("Capture failed"));
    }, failure);
    await page.locator("#btn-save-image").click();
    await expect(page.locator("#toast")).toHaveText("Failed to save image");
    expect(downloads).toBe(0);
    await expect(page.locator(".katex-html")).toHaveCount(1);
  });
}

test("a denied image clipboard and failed capture clean up without an unhandled rejection", async ({ page }) => {
  await openApp(page);
  await page.locator("#latex-input").fill("x");
  await page.evaluate(() => {
    window.ClipboardItem = class {};
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { write() { throw new DOMException("Denied", "NotAllowedError"); } }
    });
    window.html2canvas = () => Promise.reject(new Error("Capture failed after clipboard denial"));
  });
  await page.locator("#btn-copy-image").click();
  await expect(page.locator("#toast")).toHaveText("Failed to copy image");
  await expect(page.locator(".katex-html")).toHaveCount(1);
});

test("downloads the current raw LaTeX as a Markdown display equation", async ({ page }) => {
  await openApp(page);
  const latex = "\\begin{aligned}\nx &= 1 \\\\\ny &= 2\n\\end{aligned}";
  await page.locator("#latex-input").fill(latex);
  const pendingDownload = page.waitForEvent("download");
  await page.locator("#btn-save").click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe("equation.md");
  expect(await fs.readFile(await download.path(), "utf8")).toBe("$$\n" + latex + "\n$$\n");
  await expect(page.locator("#toast")).toHaveText("Markdown file saved");
});

test("saves a complete real PNG with loaded fonts for a wide formula on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  const latex = Array.from({ length: 35 }, (_, i) => `x_{${i + 1}}`).join("+");
  await page.locator("#latex-input").fill(latex);
  await page.evaluate(async () => {
    MathEditor.preview.render();
    await document.fonts.ready;
  });
  const sizes = await page.evaluate(() => ({
    formula: document.querySelector("#katex-output .katex-html").getBoundingClientRect().width,
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    fonts: Array.from(document.fonts).filter(font => font.family.includes("KaTeX") && font.status === "loaded").length
  }));
  expect(sizes.formula).toBeGreaterThan(sizes.viewport);
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.fonts).toBeGreaterThan(0);
  const pendingDownload = page.waitForEvent("download");
  await page.locator("#btn-save-image").click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe("equation.png");
  const png = await fs.readFile(await download.path());
  expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  expect(width).toBeGreaterThanOrEqual(Math.floor(sizes.formula * 2));
  expect(height).toBeGreaterThan(40);
  const ink = await page.evaluate(async dataURL => {
    const image = new Image();
    image.src = dataURL;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height).data;
    let minX = image.width;
    let maxX = -1;
    let count = 0;
    for (let offset = 0; offset < pixels.length; offset += 4) {
      if (pixels[offset + 3] > 128 && pixels[offset] < 150 && pixels[offset + 1] < 150 && pixels[offset + 2] < 150) {
        const x = (offset / 4) % image.width;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        count++;
      }
    }
    return { minX, maxX, count };
  }, "data:image/png;base64," + png.toString("base64"));
  expect(ink.count).toBeGreaterThan(100);
  expect(ink.minX).toBeLessThan(100);
  expect(ink.maxX).toBeGreaterThan(width - 100);
  await expect(page.locator("#toast")).toHaveText("Image saved");
  await expect(page.locator(".katex-html")).toHaveCount(1);
});
