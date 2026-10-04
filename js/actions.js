window.MathEditor = window.MathEditor || {};

window.MathEditor.actions = (function () {
  "use strict";

  var toastTimer = null;

  function notify(key) {
    showToast(MathEditor.i18n.t(key));
  }

  function copyText(text, successKey) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        return Promise.resolve(navigator.clipboard.writeText(text)).then(function () {
          notify(successKey);
          return true;
        }).catch(function () {
          return fallbackCopy(text, successKey);
        });
      } catch (e) {
        // Some browsers throw synchronously when clipboard access is denied.
      }
    }
    return Promise.resolve(fallbackCopy(text, successKey));
  }

  function copyLatex() {
    var latex = MathEditor.editor.getValue();
    if (!latex.trim()) return Promise.resolve(false);
    return copyText(latex, "toastCopied");
  }

  function fallbackCopy(text, successKey) {
    var activeElement = document.activeElement;
    var selectionStart = activeElement && activeElement.selectionStart;
    var selectionEnd = activeElement && activeElement.selectionEnd;
    var selectionDirection = activeElement && activeElement.selectionDirection;
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    var copied = false;
    try {
      ta.select();
      copied = document.execCommand("copy");
    } catch (e) {
      copied = false;
    } finally {
      ta.remove();
      if (activeElement && activeElement.isConnected) {
        activeElement.focus({ preventScroll: true });
        if (typeof selectionStart === "number" && activeElement.setSelectionRange) {
          activeElement.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
        }
      }
    }
    notify(copied ? successKey : "toastCopyFailed");
    return copied;
  }

  function getPreview() {
    // Flush the debounce so an immediate export uses the current input.
    if (!MathEditor.preview.render()) {
      notify("toastNoPreview");
      return null;
    }
    return document.getElementById("katex-output");
  }

  function copyMathML() {
    var outputEl = getPreview();
    if (!outputEl) return Promise.resolve(false);
    var math = outputEl.querySelector(".katex-mathml math");
    if (!math) {
      notify("toastCopyFailed");
      return Promise.resolve(false);
    }
    var markup = math.cloneNode(true);
    markup.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
    return copyText(markup.outerHTML, "toastMathMLCopied");
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    try {
      a.click();
    } finally {
      a.remove();
      // Give the browser time to start the download before releasing its URL.
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }
  }

  function saveAsMarkdown() {
    var latex = MathEditor.editor.getValue();
    if (!latex.trim()) return false;
    try {
      var content = "$$\n" + latex + "\n$$\n";
      downloadBlob(new Blob([content], { type: "text/markdown;charset=utf-8" }), "equation.md");
      notify("toastSaved");
      return true;
    } catch (e) {
      notify("toastSaveFailed");
      return false;
    }
  }

  function captureBlob(outputEl) {
    // Freeze the equation before any asynchronous work, without the preview's
    // scrolling or flex constraints. This also captures wide equations in full.
    var snapshot = outputEl.cloneNode(true);
    snapshot.removeAttribute("id");
    snapshot.setAttribute("aria-hidden", "true");
    var style = window.getComputedStyle(outputEl);
    snapshot.style.cssText = "position:absolute;left:-100000px;top:0;display:block;" +
      "width:max-content;max-width:none;min-height:0;padding:16px;border:0;" +
      "overflow:visible;background:#fff;";
    snapshot.style.fontSize = style.fontSize;
    snapshot.style.fontFamily = style.fontFamily;
    snapshot.style.lineHeight = style.lineHeight;
    snapshot.style.color = style.color;
    document.body.appendChild(snapshot);

    var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    return Promise.resolve(fontsReady).then(function () {
      var bounds = snapshot.getBoundingClientRect();
      var width = Math.ceil(Math.max(bounds.width, snapshot.scrollWidth));
      var height = Math.ceil(Math.max(bounds.height, snapshot.scrollHeight));
      // Avoid allocating an enormous canvas for accidentally unbounded LaTeX.
      if (!width || !height || width * 2 > 16384 || height * 2 > 16384 || width * height * 4 > 16777216) {
        throw new Error("Equation is too large to export as an image");
      }
      return html2canvas(snapshot, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: width,
        height: height,
        windowWidth: Math.max(window.innerWidth, width),
        windowHeight: Math.max(window.innerHeight, height),
        logging: false
      });
    }).then(function (canvas) {
      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
          if (blob) resolve(blob);
          else reject(new Error("Image encoding failed"));
        }, "image/png");
      });
    }).then(function (blob) {
      snapshot.remove();
      return blob;
    }, function (error) {
      snapshot.remove();
      throw error;
    });
  }

  function copyImage() {
    var outputEl = getPreview();
    if (!outputEl) return Promise.resolve(false);
    if (!navigator.clipboard || !navigator.clipboard.write || !window.ClipboardItem) {
      notify("toastImageCopyFailed");
      return Promise.resolve(false);
    }
    try {
      var blobPromise = captureBlob(outputEl);
      // If clipboard access fails first, still handle a later capture failure.
      blobPromise.catch(function () {});
      // Safari requires write() during the click gesture. ClipboardItem accepts
      // a promise, allowing font loading and canvas encoding to finish later.
      var item = new ClipboardItem({ "image/png": blobPromise });
      return Promise.resolve(navigator.clipboard.write([item])).then(function () {
        notify("toastImageCopied");
        return true;
      }).catch(function () {
        notify("toastImageCopyFailed");
        return false;
      });
    } catch (e) {
      notify("toastImageCopyFailed");
      return Promise.resolve(false);
    }
  }

  function saveImage() {
    var outputEl = getPreview();
    if (!outputEl) return Promise.resolve(false);
    try {
      return captureBlob(outputEl).then(function (blob) {
        downloadBlob(blob, "equation.png");
        notify("toastImageSaved");
        return true;
      }).catch(function () {
        notify("toastImageSaveFailed");
        return false;
      });
    } catch (e) {
      notify("toastImageSaveFailed");
      return Promise.resolve(false);
    }
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.setAttribute("aria-atomic", "true");
      document.body.appendChild(toast);
    }
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove("visible");
    void toast.offsetWidth;
    toast.classList.add("visible");
    toastTimer = setTimeout(function () {
      toast.classList.remove("visible");
    }, 2000);
  }

  return {
    copyLatex: copyLatex,
    copyMathML: copyMathML,
    copyImage: copyImage,
    saveAsMarkdown: saveAsMarkdown,
    saveImage: saveImage,
    showToast: showToast
  };
})();
