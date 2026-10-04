window.MathEditor = window.MathEditor || {};

window.MathEditor.editor = (function () {
  "use strict";

  var textareaEl = null;

  function init(el) {
    textareaEl = el;
  }

  function replaceSelection(text, caretOffset) {
    var start = textareaEl.selectionStart;
    var end = textareaEl.selectionEnd;
    var expected = textareaEl.value.substring(0, start) + text + textareaEl.value.substring(end);
    var emittedValue = null;

    function trackInput() {
      emittedValue = textareaEl.value;
    }

    textareaEl.focus();
    textareaEl.setSelectionRange(start, end);
    textareaEl.addEventListener("input", trackInput);
    try {
      // insertText preserves native undo history where the browser supports it.
      document.execCommand("insertText", false, text);
    } catch (e) {
      // The range fallback also supports browsers without execCommand.
    } finally {
      textareaEl.removeEventListener("input", trackInput);
    }

    if (textareaEl.value !== expected) {
      textareaEl.setRangeText(text, start, end, "end");
    }

    var newPos = Math.max(start, Math.min(start + text.length, start + caretOffset));
    textareaEl.setSelectionRange(newPos, newPos);

    // Native insertion usually emits input itself; range replacement does not.
    if (emittedValue !== textareaEl.value) {
      textareaEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function insertAtCursor(text, cursorOffset) {
    replaceSelection(text, text.length + (cursorOffset || 0));
  }

  function getValue() {
    return textareaEl.value;
  }

  function setValue(val) {
    textareaEl.value = val;
    textareaEl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function wrapSelection(before, after) {
    var selected = textareaEl.value.substring(textareaEl.selectionStart, textareaEl.selectionEnd);
    var text = before + selected + after;
    replaceSelection(text, selected ? text.length : before.length);
  }

  function clear() {
    textareaEl.setSelectionRange(0, textareaEl.value.length);
    replaceSelection("", 0);
  }

  return {
    init: init,
    insertAtCursor: insertAtCursor,
    wrapSelection: wrapSelection,
    getValue: getValue,
    setValue: setValue,
    clear: clear
  };
})();
