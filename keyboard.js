"use strict";

class Key {
    #name;
    #active;
    #onPress;
    #onRelease;

    constructor(name) {
        this.#name = name;
        this.#active = false;
        this.onPress = undefined;
        this.onRelease = undefined;
    }

    pressed(event) {
        if (this.#active) return;
        this.#active = true;
        this.#onPress(event);
    }

    released(event) {
        if (!this.#active) return;
        this.#active = false;
        this.#onRelease(event);
    }

    get active() {
        return this.#active;
    }

    set onPress(value) {
        this.#onPress = value === undefined
                ? event => {}
                : event => {
                    if (event.defaultPrevented) return;
                    value(this.#name, event);
                    event.preventDefault();
                };
    }

    get onPress() {
        return this.#onPress;
    }

    set onRelease(value) {
        this.#onRelease = value === undefined
                ? event => {}
                : event => {
                    if (event.defaultPrevented) return;
                    value(this.#name, event);
                    event.preventDefault();
                };
    }

    get onRelease() {
        return this.#onRelease;
    }
}

class Keyboard {
    static #instance;
    #keys;

    static #keymap() {
        const names = [
            "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9",
            "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9",
            "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide",
            "NumpadDecimal", "NumpadEqual", "NumpadComma", "NumpadEnter", "NumpadParenLeft", "NumpadParenRight",
            "Home", "PageUp", "PageDown", "End", "Insert", "Delete",
            "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight",
            "KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM",
            "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ",
            "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
            "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24",
            "Escape", "Backspace", "Tab", "Enter", "Space", "Pause", "PrintScreen",
            "CapsLock", "NumLock", "ScrollLock",
            "Minus", "Equal", "Semicolon", "Quote", "Backquote", "Backslash", "Comma", "Period", "Slash",
            "BracketLeft", "BracketRight",
            "ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "AltLeft", "AltRight", "MetaLeft", "MetaRight",
            "IntlBackslash", "IntlRo", "IntlYen",
            "Lang1", "Lang2", "Lang3", "Lang4", "Lang5", "KanaMode", "Convert", "NonConvert",
            "Undo", "Cut", "Copy", "Paste", "Again",
            "Help", "Props", "Select", "Open", "Find",
            "MediaTrackPrevious", "MediaTrackNext", "MediaSelect", "MediaPlayPause", "MediaStop", "Eject",
            "AudioVolumeUp", "AudioVolumeDown", "AudioVolumeMute",
            "BrowserHome", "BrowserSearch", "BrowserFavorites", "BrowserRefresh", "BrowserStop", "BrowserForward", "BrowserBack",
            "LaunchMail", "LaunchApp1", "LaunchApp2",
            "Power", "Sleep", "WakeUp",
            "ContextMenu", "Fn",
            "BrightnessUp", "BrightnessDown"
        ];

        for (let i = 0; i <= 255; i++) {
            names.push("Unidentified" + i);
        }

        const nicknames = {
            "VolumeDown": "AudioVolumeDown", "VolumeUp": "AudioVolumeUp", "VolumeMute": "AudioVolumeMute",
            "Up": "ArrowUp", "Down": "ArrowDown", "Left": "ArrowLeft", "Right": "ArrowRight",
            "PgDown": "PageDown", "PgDn": "PageDown", "PgUp": "PageUp",
            "Del": "Delete", "Ins": "Insert",
            "OSLeft": "MetaLeft", "OSRight": "MetaRight",
            "Abort": "BrowserStop"
        };
        const nicks = Object.keys(nicknames);

        const ups = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
        names.concat(nicks).forEach(name => {
            const target = names.includes(name) ? name : nicknames[name];
            nicknames[name.toLowerCase()] = target;
            nicknames[name.toUpperCase()] = target;
            if (name.charAt(0) === "F" && name.length <= 3) return;
            if (["OSLeft", "OSRight"].includes(name)) name = "os" + name.substring(2);
            let nn = name.charAt(0);
            for (const letter of name.substring(1).split("")) {
                if (ups.includes(letter)) nn += "_";
                nn += letter.toUpperCase();
            }
            nicknames[nn] = target;
            nicknames[nn.toLowerCase()] = target;
        });

        for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
            nicknames[letter] = "Key" + letter;
            nicknames[letter.toLowerCase()] = "Key" + letter;
        }

        for (let i = 1; i <= 24; i++) {
            nicknames["F_" + i] = "F" + i;
            nicknames["f_" + i] = "F" + i;
        }

        for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
            nicknames[letter] = "Key" + letter;
        }

        const keys = {};
        names.forEach(name => keys[name] = new Key(name));
        for (const nick in nicknames) {
            keys[nick] = keys[nicknames[nick]];
        }
        Object.freeze(keys);
        return keys;
    }

    constructor() {
        if (!!Keyboard.#instance) throw new TypeError("The keyboard should not be directly instantiated.");
        Keyboard.#instance = this;
        const map = Keyboard.#keymap();
        this.#keys = map;

        function locateKey(event) {
            return map[!map.hasOwnProperty(event.code) ? "Unidentified" : event.code];
        }

        document.addEventListener("keydown", event => locateKey(event).pressed (event));
        document.addEventListener("keyup"  , event => locateKey(event).released(event));
        Object.freeze(this);
    }

    static instance() {
        if (!Keyboard.#instance) Keyboard.#instance = new Keyboard();
        return Keyboard.#instance;
    }

    static get keys() {
        return Keyboard.instance().#keys;
    }

    static active(keys) {
        Keyboard.instance();
        return keys.some(x => x.active);
    }

    static onPress(keys, callback) {
        Keyboard.instance();
        keys.forEach(x => x.onPress = callback);
    }

    static onRelease(keys, callback) {
        Keyboard.instance();
        keys.forEach(x => x.onRelease = callback);
    }
}