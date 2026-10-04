window.MathEditor = window.MathEditor || {};

window.MathEditor.storage = (function () {
  "use strict";

  function read(key) {
    try {
      return { ok: true, value: window.localStorage.getItem(key) };
    } catch (e) {
      return { ok: false, value: null };
    }
  }

  function get(key, fallback) {
    var result = read(key);
    return result.ok && result.value !== null ? result.value : (fallback === undefined ? null : fallback);
  }

  function set(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  return { read: read, get: get, set: set, remove: remove };
})();
