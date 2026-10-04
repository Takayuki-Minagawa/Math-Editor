window.MathEditor = window.MathEditor || {};

(function () {
  "use strict";

  var textareaEl, outputEl, errorEl;
  var debounceTimer = null;

  // ===== Initialization =====
  document.addEventListener("DOMContentLoaded", function () {
    textareaEl = document.getElementById("latex-input");
    outputEl = document.getElementById("katex-output");
    errorEl = document.getElementById("error-output");

    MathEditor.i18n.init();
    MathEditor.editor.init(textareaEl);

    buildToolbar(
      MathEditor.toolbarData,
      document.getElementById("toolbar-panels"),
      document.getElementById("toolbar-tabs")
    );

    setupLivePreview();
    setupActionButtons();
    setupGuide();

    MathEditor.i18n.setLang(MathEditor.i18n.getLang());
    MathEditor.draft.init(textareaEl, function (status) {
      var statusEl = document.getElementById("draft-status");
      statusEl.dataset.i18n = status;
      statusEl.textContent = MathEditor.i18n.t(status);
    });
    renderPreview();
  });

  // ===== Color Palette =====
  var paletteColors = [
    { name: "red",      display: "#FF0000" },
    { name: "blue",     display: "#0000FF" },
    { name: "green",    display: "#008000" },
    { name: "orange",   display: "#FFA500" },
    { name: "purple",   display: "#800080" },
    { name: "teal",     display: "#008080" },
    { name: "violet",   display: "#EE82EE" },
    { name: "brown",    display: "#A52A2A" },
    { name: "magenta",  display: "#FF00FF" },
    { name: "cyan",     display: "#00FFFF" },
    { name: "olive",    display: "#808000" },
    { name: "pink",     display: "#FFC0CB" },
    { name: "yellow",   display: "#FFFF00" },
    { name: "darkgray", display: "#A9A9A9" },
    { name: "gray",     display: "#808080" },
    { name: "black",    display: "#000000" }
  ];

  function showColorPicker(action, triggerBtn) {
    var existing = document.getElementById("color-picker-popup");
    if (existing) {
      var sameButton = existing.dataset.trigger === action;
      closeColorPicker();
      if (sameButton) return;
    }

    var popup = document.createElement("div");
    popup.className = "color-picker-popup";
    popup.id = "color-picker-popup";
    popup.dataset.trigger = action;

    var wrapBefore = action === "textcolor"
      ? "\\textcolor{__COLOR__}{"
      : "\\colorbox{__COLOR__}{";

    paletteColors.forEach(function (color) {
      var swatch = document.createElement("button");
      swatch.className = "color-swatch";
      swatch.type = "button";
      swatch.style.backgroundColor = color.display;
      swatch.title = color.name;
      swatch.addEventListener("click", function (e) {
        e.stopPropagation();
        MathEditor.editor.wrapSelection(
          wrapBefore.replace("__COLOR__", color.name),
          "}"
        );
        closeColorPicker();
      });
      popup.appendChild(swatch);
    });

    popup.style.top = "-9999px";
    document.body.appendChild(popup);

    var rect = triggerBtn.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 4;
    var left = rect.left + window.scrollX;
    var popupRect = popup.getBoundingClientRect();
    if (left + popupRect.width > window.innerWidth - 8) {
      left = window.innerWidth - popupRect.width - 8;
    }
    if (left < 8) left = 8;
    popup.style.top = top + "px";
    popup.style.left = left + "px";

    setTimeout(function () {
      document.addEventListener("click", onOutsideClick);
    }, 0);
  }

  function closeColorPicker() {
    var popup = document.getElementById("color-picker-popup");
    if (popup) popup.remove();
    document.removeEventListener("click", onOutsideClick);
  }

  function onOutsideClick(e) {
    var popup = document.getElementById("color-picker-popup");
    if (popup && !popup.contains(e.target)) {
      closeColorPicker();
    }
  }

  // ===== Toolbar =====
  function buildToolbar(data, panelsEl, tabsEl) {
    var i18n = MathEditor.i18n;

    data.forEach(function (category, index) {
      // Tab button
      var tabBtn = document.createElement("button");
      tabBtn.className = "toolbar-tab" + (index === 0 ? " active" : "");
      tabBtn.textContent = category.icon + " " + i18n.getTabLabel(category.id);
      tabBtn.dataset.target = category.id;
      tabBtn.type = "button";
      tabBtn.addEventListener("click", function () {
        switchTab(category.id, tabsEl, panelsEl);
      });
      tabsEl.appendChild(tabBtn);

      // Panel
      var panel = document.createElement("div");
      panel.className = "toolbar-panel" + (index === 0 ? " active" : "");
      panel.id = "panel-" + category.id;

      category.buttons.forEach(function (btn) {
        var button = document.createElement("button");
        button.className = "toolbar-btn" + (btn.wide ? " wide" : "");
        button.textContent = i18n.getButtonLabel(btn.label);
        button.title = i18n.getTooltip(btn.latex || btn.action || "", btn.tooltip);
        button.type = "button";

        if (btn.action) {
          button.addEventListener("click", function (e) {
            e.stopPropagation();
            showColorPicker(btn.action, button);
          });
        } else if (btn.wrapBefore !== undefined) {
          button.addEventListener("click", function () {
            MathEditor.editor.wrapSelection(btn.wrapBefore, btn.wrapAfter);
          });
        } else {
          button.addEventListener("click", function () {
            MathEditor.editor.insertAtCursor(btn.latex, btn.cursorOffset || 0);
          });
        }

        panel.appendChild(button);
      });

      panelsEl.appendChild(panel);
    });
  }

  function switchTab(targetId, tabsEl, panelsEl) {
    var tabs = tabsEl.querySelectorAll(".toolbar-tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].dataset.target === targetId);
    }
    var panels = panelsEl.querySelectorAll(".toolbar-panel");
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.toggle("active", panels[j].id === "panel-" + targetId);
    }
  }

  // ===== Live Preview =====
  function setupLivePreview() {
    textareaEl.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(renderPreview, 150);
    });
  }

  function renderPreview() {
    clearTimeout(debounceTimer);
    var latex = textareaEl.value.trim();
    var i18n = MathEditor.i18n;
    errorEl.textContent = "";
    errorEl.classList.remove("visible");

    if (!latex) {
      outputEl.innerHTML = '<span class="placeholder">' + i18n.t("previewPlaceholder") + '</span>';
      return false;
    }

    if (!window.katex) {
      errorEl.textContent = i18n.t("rendererUnavailable");
      errorEl.classList.add("visible");
      outputEl.textContent = "";
      return false;
    }

    var options = {
      displayMode: true,
      output: "htmlAndMathml",
      throwOnError: true,
      strict: false,
      trust: false,
      maxSize: 50,
      maxExpand: 1000
    };
    try {
      outputEl.innerHTML = katex.renderToString(latex, options);
      return true;
    } catch (e) {
      errorEl.textContent = e.message;
      errorEl.classList.add("visible");

      try {
        options.throwOnError = false;
        outputEl.innerHTML = katex.renderToString(latex, options);
      } catch (e2) {
        outputEl.innerHTML = '<span class="placeholder">' + i18n.t("renderError") + '</span>';
      }
      return false;
    }
  }

  // Export actions flush the debounce so they always use the current input.
  MathEditor.preview = { render: renderPreview };

  // ===== Action Buttons =====
  function setupActionButtons() {
    document.getElementById("btn-copy").addEventListener("click", function () {
      MathEditor.actions.copyLatex();
    });

    document.getElementById("btn-copy-mathml").addEventListener("click", function () {
      MathEditor.actions.copyMathML();
    });

    document.getElementById("btn-copy-image").addEventListener("click", function () {
      MathEditor.actions.copyImage();
    });

    document.getElementById("btn-save").addEventListener("click", function () {
      MathEditor.actions.saveAsMarkdown();
    });

    document.getElementById("btn-save-image").addEventListener("click", function () {
      MathEditor.actions.saveImage();
    });

    document.getElementById("btn-clear").addEventListener("click", function () {
      MathEditor.editor.clear();
    });

    document.getElementById("btn-lang").addEventListener("click", function () {
      MathEditor.i18n.toggle();
      renderPreview();
    });
  }

  // ===== Guide Toggle =====
  function setupGuide() {
    var toggleBtn = document.getElementById("guide-toggle");
    var content = document.getElementById("guide-content");
    if (!toggleBtn || !content) return;

    toggleBtn.addEventListener("click", function () {
      var isOpen = content.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      document.getElementById("guide-arrow").textContent = isOpen ? "\u25B2" : "\u25BC";
    });
  }
})();
