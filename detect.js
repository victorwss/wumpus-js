"use strict";

/**
 * Gets the browser name or returns "Don't know" if unknown. 
 * This function also caches the result to provide for any 
 * future calls this function has.
 *
 * @returns {string}
 */
class Browser {
    static #singleton = new Browser();
    #name;

    constructor() {
        const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
        const isFirefox = typeof InstallTrigger !== "undefined";
        const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
        const isChrome = !!window.chrome && !!window.chrome.webstore;
        const isIE = /*@cc_on!@*/false || !!document.documentMode;
        const isEdge = !isIE && !!window.StyleMedia;
        //const isBlink = (isChrome || isOpera) && !!window.CSS;

        const result =
            isOpera ? "Opera" :
            isFirefox ? "Firefox" :
            isSafari ? "Safari" :
            isChrome ? "Chrome" :
            isIE ? "IE" :
            isEdge ? "Edge" :
            //isBlink ? "Blink" :
            "Don't know";

        this.#name = result;
    }

    static get name() {
        return Browser.#singleton.#name;
    }
};