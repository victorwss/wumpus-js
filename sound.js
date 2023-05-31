"use strict";

class Sound {
    #name;
    #audio;

    static #ext(audio) {
        const codecs = [
            {mime: "audio/ogg; codecs=opus"   , ext: "opus"},
            {mime: "audio/webm; codecs=opus"  , ext: "webm"},
            {mime: "audio/ogg; codecs=vorbis" , ext: "ogg" },
            {mime: "audio/webm; codecs=vorbis", ext: "webm"},
            {mime: "audio/mpeg; codecs=mp3"   , ext: "mp3" },
            {mime: "audio/ogg; codecs=flac"   , ext: "flac"},
            {mime: "audio/wav; codecs=1"      , ext: "wav" }
        ];
        for (const codec of codecs) {
            if (audio.canPlayType(codec.mime)) return codec.ext;
        }
        return "";
    }

    constructor(name, srcBuilder) {
        this.#name = name;
        this.#audio = new Audio();
        const ext = Sound.#ext(this.#audio);
        if (ext !== "") {
            this.#audio.src = srcBuilder(name, ext);
            //console.log(this.#audio.src);
            this.#audio.load();
        } else {
            this.#audio.src = "";
        }
        Object.freeze(this);
    }

    play() {
        if (this.#audio.src) {
            //throw new Error();
            this.#audio.play();
        }
    }

    stop() {
        this.#audio.pause();
        this.#audio.currentTime = 0;
        this.#audio.src = this.#audio.src;
    }

    get playing() {
        const a = this.#audio;
        return a.src && a.currentTime > 0 && !a.paused && !a.ended && a.readyState > 2;
    }

    get name() {
        return this.#name;
    }

    get audio() {
        return this.#audio;
    }

    static collect(values, srcBuilder) {
        const result = {};
        values instanceof Array
            ? values.forEach(name => result[name] = new Sound(name, srcBuilder))
            : Object.keys(values).forEach(name => result[name] = new Sound(values[name], srcBuilder));
        return result;
    }
}

class Playlist {
    #sounds;
    #musics;
    #playing;
    #musicEndedListener;

    constructor(soundNames, musicNames, soundSrcBuilder, musicSrcBuilder) {
        this.#sounds = Sound.collect(soundNames, soundSrcBuilder);
        this.#musics = Sound.collect(musicNames, musicSrcBuilder);
        this.#musicEndedListener = () => this.playAnyMusic();
        const ended = () => this.#musicEndedListener();
        Object.values(this.#musics).forEach(m => m.audio.addEventListener("ended", function() { ended(this); }));
        this.#playing = undefined;
    }

    playSound(name) {
        const sound = this.#sounds[name];
        sound.play();
        return sound;
    }

    playMusic(name) {
        this.stopMusic();
        this.#playing = musics[name];
        this.#playing.play();
        return this.#playing;
    }

    playAnyMusic() {
        const elligible = Object.values(this.#musics).filter(m => m !== this.#playing);
        this.stopMusic();
        this.#playing = elligible[Math.floor(Math.random() * elligible.length)];
        this.#playing.play();
        return this.#playing;
    }

    stopMusic() {
        if (!this.#playing) return;
        this.#playing.stop();
        this.#playing = undefined;
    }

    musicPlaying() {
        return this.#playing;
    }
}