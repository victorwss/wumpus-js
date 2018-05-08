"use strict";

var Teclado = (function() {

  var RESULTADO = {
    //KEY_UNKNOWN1: 0, // Unknown or unrecognized key. Undesirable. May represent a bug or underspecification in the browser. May fire on firefox with FN+F2 or FN+F3 (changing brightness).
    //KEY_LBUTTON: 1,  // Left mouse button. Won't be fired since it is not on keyboard (it's on the mouse).
    //KEY_RBUTTON: 2,  // Right mouse button. Won't be fired since it is not on keyboard (it's on the mouse).
    //KEY_BREAK: 3,    // Lacking in almost all keyboards. Buggy on chrome.
    //KEY_MBUTTON: 4,  // Middle mouse button. Lacking in some mouses. Won't be fired since it is not on keyboard (it's on the mouse).
    //KEY_XBUTTON1: 5, // Fourth mouse button. Lacking in almost all mouses. Won't be fired since it is not on keyboard (it's on the mouse).
    //KEY_XBUTTON2: 6, // Fifth mouse button. Lacking in almost all mouses. Won't be fired since it is not on keyboard (it's on the mouse).
    // 7
    KEY_BKSP: 8,
    KEY_TAB: 9,
    // 10-11
    KEY_CLEAR: 12, // Numpad 5 with numlock off.
    KEY_ENTER: 13, // Can't distinguish main or keypad enters, both keys maps to this.
    // 14-15
    KEY_SHIFT: 16, // Can't distinguish left or right shift, both keys maps to this.
    KEY_CTRL: 17,  // Can't distinguish left or right ctrl, both keys maps to this.
    KEY_ALT: 18,   // Can't distinguish left or right alt, both keys maps to this. On windows, right Alt also fires Ctrl due to a stupidity in windows API (right Alt is considered as Ctrl+Alt in a single key).
    KEY_PAUSE: 19, // Pause/break key.
    KEY_CAPS_LOCK: 20,
    //KEY_KANA: 21,   // Specific for Japanese keyboards.
    //KEY_HANGUL: 22, // Specific for Korean keyboards. Collides with KEY_JUNJA.
    //KEY_JUNJA: 22,  // Specific for Japanese? Collides with KEY_HANGUL.
    //KEY_FINAL: 23,  // Specific for Japanese?
    //KEY_HANJA: 24,  // Specific for Korean keyboards. Collides with KEY_KANJI.
    //KEY_KANJI: 24,  // Specific for Japanese keyboards. Collides with KEY_HANJA.
    // 25-26
    KEY_ESCAPE: 27,
    //KEY_CONVERT: 28,
    //KEY_NONCONVERT: 29,
    //KEY_ACCEPT: 30,
    //KEY_MODE_CHANGE: 31,
    KEY_SPACE: 32,
    KEY_PGUP: 33,
    KEY_PGDW: 34,
    KEY_END: 35,
    KEY_HOME: 36,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    //KEY_SELECT: 41,     // Lacking in most keyboards.
    //KEY_PRINT: 42,      // Lacking in most keyboards.
    //KEY_EXECUTE: 43,    // Lacking in most keyboards.
    KEY_PRINT_SCREEN: 44, // Don't fires keydown. Not recommended for general purpose uses.
    KEY_INSERT: 45,
    KEY_DELETE: 46,
    //KEY_HELP: 47,       // Lacking in most keyboards.
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    //KEY_COLON: 58,    // Won't fire as keyup or keydown.
    KEY_SEMICOLON1: 59, // ";" or ":". Firefox-only (chrome and IE uses 186).
    //KEY_LT: 60,       // Won't fire as keyup or keydown.
    KEY_EQUALS: 61,     // "=" or "+". Firefox-only (chrome and IE uses 187).
    //KEY_GT: 62,       // Won't fire as keyup or keydown.
    //KEY_SS: 63,       // Won't fire as keyup or keydown. Collides with KEY_QUESTION.
    //KEY_QUESTION: 63, // Won't fire as keyup or keydown. Collides with KEY_SS.
    //KEY_AT_SIGN: 64,  // Won't fire as keyup or keydown. Firefox-only.
    KEY_A: 65,
    KEY_B: 66,
    KEY_C: 67,
    KEY_D: 68,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_M: 77,
    KEY_N: 78,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Q: 81,
    KEY_R: 82,
    KEY_S: 83,
    KEY_T: 84,
    KEY_U: 85,
    KEY_V: 86,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Y: 89,
    KEY_Z: 90,
    //KEY_LWIN: 91,     // Interferes with normal OS use. May fire with FN+F1 or FN+F4. May not fire key up. Collides with KEY_LCOMMAND.
    //KEY_LCOMMAND: 91, // Interferes with normal OS use. Chrome-only (firefox uses 224). Collides with KEY_LWIN.
    //KEY_RWIN: 92,     // Interferes with normal OS use. Has portability problems. 
    //KEY_MENU: 93,     // Interferes with normal OS use. Has portability problems. Collides with KEY_RCOMMAND.
    //KEY_RCOMMAND: 93, // Interferes with normal OS use. Has portability problems. Chrome-only (firefox uses 224). Collides with KEY_MENU.
    // 94
    //KEY_SLEEP: 95,    // Interferes with normal OS use. Not recommended for general purpose uses.
    KEY_NUMPAD_0: 96,  // Numlock must be on in order to fire, otherwise fires KEY_INSERT.
    KEY_NUMPAD_1: 97,  // Numlock must be on in order to fire, otherwise fires KEY_END.
    KEY_NUMPAD_2: 98,  // Numlock must be on in order to fire, otherwise fires KEY_DOWN.
    KEY_NUMPAD_3: 99,  // Numlock must be on in order to fire, otherwise fires KEY_PGDW.
    KEY_NUMPAD_4: 100, // Numlock must be on in order to fire, otherwise fires KEY_LEFT.
    KEY_NUMPAD_5: 101, // Numlock must be on in order to fire, otherwise fires KEY_CLEAR.
    KEY_NUMPAD_6: 102, // Numlock must be on in order to fire, otherwise fires KEY_RIGHT.
    KEY_NUMPAD_7: 103, // Numlock must be on in order to fire, otherwise fires KEY_HOME.
    KEY_NUMPAD_8: 104, // Numlock must be on in order to fire, otherwise fires KEY_UP.
    KEY_NUMPAD_9: 105, // Numlock must be on in order to fire, otherwise fires KEY_PGUP.
    KEY_NUMPAD_MULT: 106,
    KEY_NUMPAD_ADD: 107,
    KEY_NUMPAD_DOT1: 108, // Lacking in some keyboards. Firefox-only (chrome and IE uses 194).
    KEY_NUMPAD_SUB: 109,
    KEY_NUMPAD_POINT: 110,
    KEY_NUMPAD_DIV: 111,
    KEY_F1: 112,
    KEY_F2: 113,
    KEY_F3: 114,
    KEY_F4: 115,
    KEY_F5: 116,
    KEY_F6: 117,
    KEY_F7: 118,
    KEY_F8: 119,
    KEY_F9: 120,
    KEY_F10: 121,
    KEY_F11: 122,
    KEY_F12: 123,
    //KEY_F13: 124, // Lacking in almost all keyboards.
    //KEY_F14: 125, // Lacking in almost all keyboards.
    //KEY_F15: 126, // Lacking in almost all keyboards.
    //KEY_F16: 127, // Lacking in almost all keyboards.
    //KEY_F17: 128, // Lacking in almost all keyboards.
    //KEY_F18: 129, // Lacking in almost all keyboards.
    //KEY_F19: 130, // Lacking in almost all keyboards.
    //KEY_F20: 131, // Lacking in almost all keyboards.
    //KEY_F21: 132, // Lacking in almost all keyboards.
    //KEY_F22: 133, // Lacking in almost all keyboards.
    //KEY_F23: 134, // Lacking in almost all keyboards.
    //KEY_F24: 135, // Lacking in almost all keyboards.
    // 136-143
    KEY_NUM_LOCK: 144,
    KEY_SCROLL_LOCK: 145, // Lacking in some keyboards.
    // 146-159
    //KEY_CARET: 160,           // Won't fire as keyup or keydown. Collides with KEY_LEFT_SHIFT.
    //KEY_LSHIFT: 160,          // Won't fire as keyup or keydown. Collides with KEY_CARET.
    //KEY_EXCLAMATION: 161,     // Won't fire as keyup or keydown. Collides with KEY_RIGHT_SHIFT.
    //KEY_RSHIFT: 161,          // Won't fire as keyup or keydown. Collides with KEY_EXCLAMATION.
    //KEY_LCONTROL: 162,        // Won't fire as keyup or keydown.
    //KEY_HASHTAG: 163,         // Won't fire as keyup or keydown. Lacking in almost all keyboards. Collides with KEY_RCONTROL.
    //KEY_RCONTROL: 163,        // Won't fire as keyup or keydown. Collides with KEY_HASHTAG.
    //KEY_DOLLAR: 164,          // Won't fire as keyup or keydown. Lacking in almost all keyboards. Collides with KEY_LMENU.
    //KEY_LMENU: 164,           // Won't fire as keyup or keydown. Collides with KEY_DOLLAR.
    //KEY_UGRAVE: 165,          // Won't fire as keyup or keydown. Lacking in almost all keyboards. Collides with KEY_RMENU.
    //KEY_RMENU: 165,           // Won't fire as keyup or keydown. Collides with KEY_UGRAVE.
    //KEY_BROWSER_BACK: 166,    // Lacking in almost all keyboards.
    //KEY_BROWSER_NEXT: 167,    // Lacking in almost all keyboards.
    //KEY_OPEN_PAREN: 169,      // Lacking in almost all keyboards. Collides with KEY_BROWSER_REFRESH.
    //KEY_BROWSER_REFRESH: 168, // Lacking in almost all keyboards. Collides with KEY_OPEN_PAREN.
    //KEY_CLOSE_PAREN: 169,     // Lacking in almost all keyboards. Collides with KEY_BROWSER_STOP.
    //KEY_BROWSER_STOP: 169,    // Lacking in almost all keyboards. Collides with KEY_CLOSE_PAREN.
    //KEY_ASTERISK: 170,        // Lacking in almost all keyboards. Collides with KEY_BROWSER_SEARCH.
    //KEY_BROWSER_SEARCH: 170,  // Lacking in almost all keyboards. Collides with KEY_ASTERISK. Won't fire on chrome.
    //KEY_SPECIAL_CHAR: 171,    // Special accented characters. Lacking in almost all keyboards. Collides with KEY_BROWSER_FAVS.
    //KEY_BROWSER_FAVS: 171,    // Lacking in almost all keyboards. Collides with KEY_SPECIAL_CHAR.
    //KEY_BROWSER_HOME: 172,    // Lacking in almost all keyboards. 
    KEY_MUTE1: 173,        // Lacking in many keyboards. Interferes with normal OS use. May fire on chrome and IE with FN+F6. Firefox uses 181. Collides with KEY_DASH1.
    KEY_DASH1: 173,        // "-" or "_". Firefox-only (chrome and IE uses 189). Collides with KEY_MUTE1.
    KEY_VOLUME_DOWN1: 174, // Lacking in many keyboards. Interferes with normal OS use. May fire on chrome and IE with FN+F7. Firefox uses 182.
    KEY_VOLUME_UP1: 175,   // Lacking in many keyboards. Interferes with normal OS use. May fire on chrome and IE with FN+F8. Firefox uses 183.
    //KEY_NEXT: 176,         // Lacking in many keyboards. Interferes with normal OS use. May fire with FN+F11.
    //KEY_PREVIOUS: 177,     // Lacking in many keyboards. Interferes with normal OS use. May fire with FN+F9.
    //KEY_STOP: 178,         // Lacking in many keyboards. Interferes with normal OS use.
    //KEY_PAUSE: 179,        // Lacking in many keyboards. Interferes with normal OS use. May fire with FN+F10.
    //KEY_EMAIL: 180,        // Lacking in many keyboards. Interferes with normal OS use.
    KEY_MUTE2: 181,        // Lacking in many keyboards. Interferes with normal OS use. May fire on firefox with FN+F6. IE and chrome uses 173.
    KEY_VOLUME_DOWN2: 182, // Lacking in many keyboards. Interferes with normal OS use. May fire on firefox with FN+F7. IE and chrome uses 174.
    KEY_VOLUME_UP2: 183,   // Lacking in many keyboards. Interferes with normal OS use. May fire on firefox with FN+F8. IE and chrome uses 175.
    // 184-185
    KEY_SEMICOLON2: 186,   // ";" or ":". Chrome and IE (firefox uses 59). 
    KEY_EQUAL2: 187,       // "=" or "+". Chrome and IE (firefox uses 61).
    KEY_COMMA: 188,        // "," or "<"
    KEY_DASH2: 189,        // "-" or "_". Chrome and IE (firefox uses 173).
    KEY_PERIOD: 190,       // "." or ">"
    KEY_SLASH: 191,        // "/" or "?"
    KEY_GRAVE: 192,       // "`" or "~"
    //KEY_ORDINAL: 193,      // Lacking in many keyboards.
    KEY_NUMPAD_DOT2: 194,  // Lacking in some keyboards. Chrome-only (firefox uses 108).
    // 195-218
    KEY_OPEN_BRACKET: 219,  // "[" or "{"
    KEY_BACKSLASH: 220,     // "\" or "|"
    KEY_CLOSE_BRACKET: 221, // "]" or "}"
    KEY_QUOTE: 222,         // "'" or '"'
    //KEY_BACKTICK: 223,      // Won't fire as keyup or keydown. 
    //KEY_FCOMMAND: 224,      // Lacking in some keyboards. Interferes with normal OS use. Non-portable. Firefox-only (chrome uses 91 and 93).
    //KEY_ALT_GR: 225,        // Won't fire as keyup or keydown, will show up as KEY_ALT instead.
    //KEY_GIT: 266,           // Very dubious.
    // 227-229
    //KEY_GNOME: 230,         // Very dubious.
    // 231-232
    //KEY_XF86_FORWARD: 233,  // Very dubious.
    //KEY_XF86_BACK: 234,     // Very dubious.
    // 235-254
    //KEY_UNKNOWN2: 255       // Unknown, unrecognized key. Undesirable. May represent a bug or underspecification in the browser. May fire on chrome with FN+F2 or FN+F3 (changing brightness).
  };

  RESULTADO.KEY_SEMICOLON   = browser() === "Firefox" ? RESULTADO.KEY_SEMICOLON1   : RESULTADO.KEY_SEMICOLON2;
  RESULTADO.KEY_EQUAL       = browser() === "Firefox" ? RESULTADO.KEY_EQUAL1       : RESULTADO.KEY_EQUAL2;
  RESULTADO.KEY_DASH        = browser() === "Firefox" ? RESULTADO.KEY_DASH1        : RESULTADO.KEY_DASH2;
  RESULTADO.KEY_MUTE        = browser() === "Firefox" ? RESULTADO.KEY_MUTE2        : RESULTADO.KEY_MUTE1;
  RESULTADO.KEY_NUMPAD_DOT  = browser() === "Firefox" ? RESULTADO.KEY_NUMPAD_DOT1  : RESULTADO.KEY_NUMPAD_DOT2;
  RESULTADO.KEY_VOLUME_DOWN = browser() === "Firefox" ? RESULTADO.KEY_VOLUME_DOWN2 : RESULTADO.KEY_VOLUME_DOWN1;
  RESULTADO.KEY_VOLUME_UP   = browser() === "Firefox" ? RESULTADO.KEY_VOLUME_UP2   : RESULTADO.KEY_VOLUME_UP1;

  RESULTADO.criar = function(doc) {
    var teclado = {};

    var pressionadas = [];
    var funcoesDisparo = [];
    var funcoesSolto = [];

    doc.addEventListener('keydown', function(evento) {
      var tecla = evento.keyCode;
      var disparar = !!funcoesDisparo[tecla] && !pressionadas[tecla]; // Disparar somente se for o primeiro keydown da tecla
      pressionadas[tecla] = true;
      //console.log("keydown " + evento.keyCode);
      if (disparar) {
        funcoesDisparo[tecla]();
        evento.preventDefault();
      }
    });

    doc.addEventListener('keyup', function(evento) {
      var tecla = evento.keyCode;
      var disparar = !!funcoesSolto[tecla] && pressionadas[tecla];
      pressionadas[tecla] = false;
      //console.log("keyup " + evento.keyCode);
      if (disparar) {
        funcoesSolto[tecla]();
        evento.preventDefault();
      }
    });

    teclado.pressionada = function(teclas) {
      for (var i in teclas) {
        if (pressionadas[teclas[i]]) return true;
      }
      return false;
    },

    teclado.aoPressionar = function(teclas, callback) {
      for (var i in teclas) {
        funcoesDisparo[teclas[i]] = callback;
      }
    },

    teclado.aoSoltar = function(teclas, callback) {
      for (var i in teclas) {
        funcoesSolto[teclas[i]] = callback;
      }
    };

    Object.freeze(teclado);
    return teclado;
  };

  Object.freeze(RESULTADO);
  return RESULTADO;
})();