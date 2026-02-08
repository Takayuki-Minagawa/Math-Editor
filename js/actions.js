window.MathEditor = window.MathEditor || {};

window.MathEditor.actions = (function () {

  function copyLatex() {
    var latex = MathEditor.editor.getValue();
    if (!latex.trim()) return;
    var i18n = MathEditor.i18n;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(latex).then(function () {
        showToast(i18n.t("toastCopied"));
      }).catch(function () {
        fallbackCopy(latex);
      });
    } else {
      fallbackCopy(latex);
    }
  }

  function fallbackCopy(text) {
    var i18n = MathEditor.i18n;
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(i18n.t("toastCopied"));
    } catch (e) {
      showToast(i18n.t("toastCopyFailed"));
    }
    document.body.removeChild(ta);
  }

  function saveAsMarkdown() {
    var latex = MathEditor.editor.getValue();
    if (!latex.trim()) return;

    var content = "$$\n" + latex + "\n$$\n";
    var blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "equation.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast(MathEditor.i18n.t("toastSaved"));
  }

  function copyImage() {
    var outputEl = document.getElementById("katex-output");
    var i18n = MathEditor.i18n;

    // Check if there's content to capture
    if (!outputEl || !outputEl.textContent.trim() || outputEl.querySelector(".placeholder")) {
      showToast(i18n.t("toastNoPreview"));
      return;
    }

    html2canvas(outputEl, {
      backgroundColor: "#ffffff",
      scale: 2 // Higher quality
    }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        if (navigator.clipboard && window.ClipboardItem) {
          var item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(function () {
            showToast(i18n.t("toastImageCopied"));
          }).catch(function () {
            showToast(i18n.t("toastImageCopyFailed"));
          });
        } else {
          showToast(i18n.t("toastImageCopyFailed"));
        }
      }, "image/png");
    }).catch(function () {
      showToast(i18n.t("toastImageCopyFailed"));
    });
  }

  function saveImage() {
    var outputEl = document.getElementById("katex-output");
    var i18n = MathEditor.i18n;

    // Check if there's content to capture
    if (!outputEl || !outputEl.textContent.trim() || outputEl.querySelector(".placeholder")) {
      showToast(i18n.t("toastNoPreview"));
      return;
    }

    html2canvas(outputEl, {
      backgroundColor: "#ffffff",
      scale: 2 // Higher quality
    }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "equation.png";
        a.click();
        URL.revokeObjectURL(url);
        showToast(i18n.t("toastImageSaved"));
      }, "image/png");
    }).catch(function () {
      showToast(i18n.t("toastImageCopyFailed"));
    });
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove("visible");
    void toast.offsetWidth;
    toast.classList.add("visible");
    setTimeout(function () {
      toast.classList.remove("visible");
    }, 2000);
  }

  return {
    copyLatex: copyLatex,
    copyImage: copyImage,
    saveAsMarkdown: saveAsMarkdown,
    saveImage: saveImage,
    showToast: showToast
  };
})();
