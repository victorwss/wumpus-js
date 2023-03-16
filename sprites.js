"use strict";

class SpriteSheet {
    #imagem;
    #largura;
    #altura;

    constructor(linhas, colunas, src, finished) {
        this.#imagem = new Image();
        this.#largura = -1;
        this.#altura = -1;

        this.#imagem.onload = () => {
            this.#largura = this.#imagem.width / colunas;
            this.#altura = this.#imagem.height / linhas;
            finished(this);
        };
        this.#imagem.src = src;
    }

    sprite(linha, coluna) {
        return new Sprite(this.#imagem, linha, coluna, this.#largura, this.#altura);
    }

    get largura() {
        return this.#largura;
    }

    get altura() {
        return this.#altura;
    }
}

class Sprite {
    #imagem;
    #linha;
    #coluna;
    #largura;
    #altura;

    constructor(imagem, linha, coluna, largura, altura) {
        this.#imagem = imagem;
        this.#linha = linha;
        this.#coluna = coluna;
        this.#largura = largura;
        this.#altura = altura;
    }

    draw(ctx, x, y) {
        ctx.drawImage(
            this.#imagem,
            this.#coluna * this.#largura, this.#linha * this.#altura, this.#largura, this.#altura,
            x, y, this.#largura, this.#altura
        );
    }
}