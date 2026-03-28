window.MathEditor = window.MathEditor || {};

window.MathEditor.editor = (function () {
  var textareaEl = null;

  function init(el) {
    textareaEl = el;
  }

  function insertAtCursor(text, cursorOffset) {
    textareaEl.focus();
    var start = textareaEl.selectionStart;
    var end = textareaEl.selectionEnd;

    // execCommand preserves the browser's undo stack
    var inserted = false;
    try {
      inserted = document.execCommand("insertText", false, text);
    } catch (e) {
      inserted = false;
    }

    if (!inserted) {
      var before = textareaEl.value.substring(0, start);
      var after = textareaEl.value.substring(end);
      textareaEl.value = before + text + after;
    }

    var newPos = start + text.length + (cursorOffset || 0);
    textareaEl.selectionStart = newPos;
    textareaEl.selectionEnd = newPos;

    textareaEl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function getValue() {
    return textareaEl.value;
  }

  function setValue(val) {
    textareaEl.value = val;
    textareaEl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function wrapSelection(before, after) {
    textareaEl.focus();
    var start = textareaEl.selectionStart;
    var end = textareaEl.selectionEnd;
    var selected = textareaEl.value.substring(start, end);
    var text = before + selected + after;

    var inserted = false;
    try {
      inserted = document.execCommand("insertText", false, text);
    } catch (e) {
      inserted = false;
    }

    if (!inserted) {
      var beforeText = textareaEl.value.substring(0, start);
      var afterText = textareaEl.value.substring(end);
      textareaEl.value = beforeText + text + afterText;
    }

    if (selected) {
      var newPos = start + text.length;
      textareaEl.selectionStart = newPos;
      textareaEl.selectionEnd = newPos;
    } else {
      var newPos = start + before.length;
      textareaEl.selectionStart = newPos;
      textareaEl.selectionEnd = newPos;
    }

    textareaEl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function clear() {
    textareaEl.value = "";
    textareaEl.dispatchEvent(new Event("input", { bubbles: true }));
    textareaEl.focus();
  }

  return { init: init, insertAtCursor: insertAtCursor, wrapSelection: wrapSelection, getValue: getValue, setValue: setValue, clear: clear };
})();
