"use strict";

class IntVar {
    #varName;
    #label;
    #value;
    #checker;

    constructor(varName, initialValue, label, plusButton, minusButton) {
        const eu = this;
        this.#varName = varName;
        this.#label = label;
        this.#value = initialValue;
        this.#checker = v => v;
        plusButton.onclick = () => this.value++;
        minusButton.onclick = () => this.value--;
        this.value = initialValue;
        Object.seal(this);
    }

    recalculate() {
        this.value += 0;
    }

    get value() {
        return this.#value;
    }

    set value(newValue) {
        this.#value = this.#checker(this.#value, newValue);
        this.#label.innerHTML = this.#varName + ": " + this.#value;
    }

    set checker(newChecker) {
        this.#checker = newChecker;
    }
}

class BoolVar {
    #value;
    #checker;
    #nameOn;
    #nameOff;
    #button;

    constructor(nameOn, nameOff, initialValue, button) {
        this.#nameOn = nameOn;
        this.#nameOff = nameOff;
        this.#value = initialValue;
        this.#checker = v => v;
        this.#button = button;
        button.onclick = () => {
            this.value = !this.value;
            return this.#value;
        };
        this.value = initialValue;
        Object.seal(this);
    }

    recalculate() {
        this.value = this.value;
    }

    get value() {
        return this.#value;
    }

    set value(newValue) {
        this.#value = this.#checker(this.#value, newValue);
        this.#button.innerHTML = newValue ? this.#nameOff : this.#nameOn;
    }

    set checker(newChecker) {
        this.#checker = newChecker;
    }
}

const nomesMusicas = [
    "Always-On-My-Mind",
    "Andanca",
    "Anna-Julia",
    "Another-Brick-In-The-Wall",
    "Back-For-Good",
    "Blue-Danube",
    "Como-Eu-Quero",
    "Dancing-Queen",
    "Dancing-With-Myself",
    "Down-Under",
    "Evidencias",
    "Girls-Just-Want-To-Have-Fun",
    "Hotel-California",
    "Ilarie",
    "I-Want-It-That-Way",
    "Joyride",
    "Maluco-Beleza",
    "Mambo-No-5",
    "Never-Gonna-Give-You-Up",
    "Primeiros-Erros",
    "Rockin-Robin",
    "Sera",
    "Stairway-To-Heaven",
    "Sugar-Sugar",
    "The-Entertainer",
    "The-Unforgiven",
    "Total-Eclipse-Of-The-Heart",
    "Truly-Madly-Deeply",
    "Twist-And-Shout",
    "Vem-Quente-Que-Eu-Estou-Fervendo",
    "Vira-Vira",
    "Whats-Up"
];
const nomesSons = {
    "acertou": "urro",
    "errou": "fhaha",
    "buraco": "nooo",
    "wumpus": "comeu",
    "ouro": "woohoo"
};

class Config {
    #btRecomecar;
    #subtitulo;
    #varLargura;
    #varAltura;
    #varBuracos;
    #varSom;
    #varMusica;
    #novoListener;

    constructor(doc, subtitulo, btRecomecar, varLargura, varAltura, varBuracos, varSom, varMusica, repertorio) {
        this.#btRecomecar = btRecomecar;
        this.#subtitulo = subtitulo;
        this.#varSom = varSom;
        this.#varMusica = varMusica;
        this.#varLargura = varLargura;
        this.#varAltura = varAltura;
        this.#varBuracos = varBuracos;
        btRecomecar.onclick = () => {};

        function clamp(min, mid, max) {
            return mid < min ? min : mid > max ? max : mid;
        }

        varLargura.checker = (velho, novo) => {
            var novo = clamp(8, novo, 20);
            if (novo !== velho) {
                btRecomecar.click();
                varBuracos.recalculate();
            }
            return novo;
        };

        varAltura.checker = (velho, novo) => {
            var novo = clamp(8, novo, 20);
            if (novo !== velho) {
                btRecomecar.click();
                varBuracos.recalculate();
            }
            return novo;
        };

        varBuracos.checker = (velho, novo) => {
            var area = varLargura.valor * varAltura.valor;
            var novo = clamp(4, novo, Math.floor(area / 6));
            if (novo !== velho) btRecomecar.click();
            return novo;
        };

        varMusica.checker = (velho, novo) => {
            if (velho === novo) return novo;
            if (novo) {
                repertorio.playAnyMusic();
            } else {
                repertorio.stopMusic();
            }
            return novo;
        };
        Object.seal(this);
    }

    get somLigado() {
        return this.#varSom.value;
    }

    get musicaLigada() {
        return this.#varMusica.value;
    }

    get largura() {
        return this.#varLargura.value;
    }

    get altura() {
        return this.#varAltura.value;
    }

    get buracos() {
        return this.#varBuracos.value;
    }

    set novoListener(novo) {
        this.#btRecomecar.onclick = novo;
    }

    set subtitulo(texto) {
        this.#subtitulo.innerHTML = texto;
    }
}

class MapaController {

    constructor(canvas, cfgs, spritesheet, repertorio) {
        let modelo, especial;
        const teclas = Keyboard.keys;

        let criarNovo = true;
        cfgs.novoListener = () => criarNovo = true;

        function movimento(direcao) {
            return (nome, evento) => {
                if (especial !== Tiro.NAO_PODE_ATIRAR) return;
                const resultado = evento.shiftKey
                              ? (especial = modelo.atirar(direcao))
                              : modelo.mover(direcao);
                const som = resultado === Tiro.ACERTOU ? "acertou"
                          : resultado === Tiro.ERROU ? "errou"
                          : resultado instanceof Buraco ? "buraco"
                          : resultado instanceof Wumpus ? "wumpus"
                          : resultado instanceof Ouro ? "ouro"
                          : null;
                if (cfgs.somLigado && som) repertorio.playSound(som);
            };
        }

        Keyboard.onPress([teclas.LEFT,  teclas.NUMPAD_4, teclas.KEY_A], movimento(Direcao.ESQUERDA));
        Keyboard.onPress([teclas.RIGHT, teclas.NUMPAD_6, teclas.KEY_D], movimento(Direcao.DIREITA ));
        Keyboard.onPress([teclas.UP,    teclas.NUMPAD_8, teclas.KEY_W], movimento(Direcao.SOBE    ));
        Keyboard.onPress([teclas.DOWN,  teclas.NUMPAD_2, teclas.KEY_S], movimento(Direcao.DESCE   ));
        Keyboard.onPress([teclas.ENTER], () => especial = Tiro.NAO_PODE_ATIRAR);

        function comecar() {
            especial = Tiro.NAO_PODE_ATIRAR;
            const w = cfgs.largura;
            const h = cfgs.altura;
            const b = cfgs.buracos;
            modelo = new Mapa(h, w, b);
            if (cfgs.musicaLigada) repertorio.playAnyMusic();
            criarNovo = false;
        }

        function acao() {
            if (criarNovo) {
                comecar();
            }
        }

        function desenho(quadro) {
            const w = cfgs.largura;
            const h = cfgs.altura;

            canvas.width = spritesheet.spriteSize.width * w;
            canvas.height = spritesheet.spriteSize.height * h;

            if (!canvas.width || !canvas.height) throw new Error("FUUUU" + w + "--" + h);
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const msg = desenharModelo(modelo, spritesheet, ctx, quadro, especial);
            cfgs.subtitulo = msg;
        }

        comecar();
        mainLoop(250, acao, desenho);
    }
}