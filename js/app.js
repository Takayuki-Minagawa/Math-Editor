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

    // Apply saved language
    var lang = MathEditor.i18n.getLang();
    if (lang !== "ja") {
      MathEditor.i18n.setLang(lang);
    }
  });

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
        button.title = i18n.getTooltip(btn.latex, btn.tooltip);
        button.type = "button";
        button.addEventListener("click", function () {
          MathEditor.editor.insertAtCursor(btn.latex, btn.cursorOffset || 0);
        });
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
    var latex = textareaEl.value.trim();
    var i18n = MathEditor.i18n;
    errorEl.textContent = "";
    errorEl.classList.remove("visible");

    if (!latex) {
      outputEl.innerHTML = '<span class="placeholder">' + i18n.t("previewPlaceholder") + '</span>';
      return;
    }

    try {
      outputEl.innerHTML = katex.renderToString(latex, {
        displayMode: true,
        throwOnError: true,
        strict: false,
        trust: true
      });
    } catch (e) {
      errorEl.textContent = e.message;
      errorEl.classList.add("visible");

      try {
        outputEl.innerHTML = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
          strict: false
        });
      } catch (e2) {
        outputEl.innerHTML = '<span class="placeholder">' + i18n.t("renderError") + '</span>';
      }
    }
  }

  // ===== Action Buttons =====
  function setupActionButtons() {
    document.getElementById("btn-copy").addEventListener("click", function () {
      MathEditor.actions.copyLatex();
    });

    document.getElementById("btn-save").addEventListener("click", function () {
      MathEditor.actions.saveAsMarkdown();
    });

    document.getElementById("btn-clear").addEventListener("click", function () {
      MathEditor.editor.clear();
    });

    document.getElementById("btn-lang").addEventListener("click", function () {
      MathEditor.i18n.toggle();
      // Re-render preview placeholder if empty
      if (!textareaEl.value.trim()) {
        outputEl.innerHTML = '<span class="placeholder">' + MathEditor.i18n.t("previewPlaceholder") + '</span>';
      }
    });
  }
})();
