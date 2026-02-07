window.MathEditor = window.MathEditor || {};

window.MathEditor.actions = (function () {

  function copyLatex() {
    var latex = MathEditor.editor.getValue();
    if (!latex.trim()) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(latex).then(function () {
        showToast("LaTeXをコピーしました");
      }).catch(function () {
        fallbackCopy(latex);
      });
    } else {
      fallbackCopy(latex);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("LaTeXをコピーしました");
    } catch (e) {
      showToast("コピーに失敗しました");
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
    showToast("Markdownファイルを保存しました");
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
    // Force reflow to restart animation
    void toast.offsetWidth;
    toast.classList.add("visible");
    setTimeout(function () {
      toast.classList.remove("visible");
    }, 2000);
  }

  return { copyLatex: copyLatex, saveAsMarkdown: saveAsMarkdown, showToast: showToast };
})();
