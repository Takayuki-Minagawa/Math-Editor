window.MathEditor = window.MathEditor || {};

window.MathEditor.draft = (function () {
  "use strict";

  var storageKey = "mathEditorDraft";

  function init(textareaEl, onStatus) {
    function report(key) {
      if (onStatus) onStatus(key);
    }

    var stored = MathEditor.storage.read(storageKey);
    if (!stored.ok) {
      report("draftUnavailable");
    } else if (stored.value !== null && stored.value !== "") {
      textareaEl.value = stored.value;
      report("draftRestored");
    } else {
      report("draftEmpty");
    }

    textareaEl.addEventListener("input", function () {
      var value = textareaEl.value;
      var saved = value === ""
        ? MathEditor.storage.remove(storageKey)
        : MathEditor.storage.set(storageKey, value);
      report(saved ? (value === "" ? "draftEmpty" : "draftSaved") : "draftUnavailable");
    });
  }

  return { init: init };
})();
