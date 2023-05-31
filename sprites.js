"use strict";

class Picture {
    #imagem;
    #size;
    #load;
    #ready;

    constructor(src) {
        if (typeof src !== "string") throw new TypeError();
        this.#imagem = new Image();
        this.#size = undefined;
        this.#ready = false;

        this.#load = new Promise((resolve, reject) => {
            this.#imagem.onload = () => {
                this.#size = new Size(this.#imagem.width, this.#imagem.height);
                resolve(this);
                this.#ready = true;
            };
        });
        this.#imagem.src = src;
    }

    get size() {
        return this.#size;
    }

    get image() {
        return this.#imagem;
    }

    get ready() {
        return this.#ready;
    }

    async whenReady() {
        return await this.#load;
    }
}

class SpriteSheet {
    #picture;
    #board;
    #spriteSize;

    static async create(rows, columns, src) {
        if (!isNum(rows) || !isNum(columns) || typeof src !== "string") throw new TypeError();
        const img = new Picture(src);
        await img.whenReady();
        return new SpriteSheet(rows, columns, img);
    }

    constructor(rows, columns, picture) {
        if (!isNum(rows) || !isNum(columns) || !(picture instanceof Picture)) throw new TypeError();
        if (!picture.ready) throw new RangeError();
        this.#picture = picture;
        this.#board = new Board(rows, columns);
        this.#spriteSize = new Size(this.#picture.size.width / columns, this.#picture.size.height / rows);
        console.log(this);
    }

    sprite(position) {
        if (!(position instanceof BoardPosition)) throw new TypeError();
        return new Sprite(this.#picture, position, this.spriteSize, this);
    }

    at(row, column) {
        if (!isNum(row) || !isNum(column)) throw new TypeError();
        if (row < 0 || column < 0 || row >= this.board.rows || column >= this.board.columns) throw new RangeError();
        return this.sprite(this.board.at(row, column));
    }

    get board() {
        return this.#board;
    }

    get spriteSize() {
        return this.#spriteSize;
    }
}

class Sprite {
    #picture;
    #position;
    #size;
    #sheet;

    constructor(picture, position, size, sheet) {
        if (!(picture instanceof Picture)) throw new TypeError();
        if (!(position instanceof BoardPosition)) throw new TypeError();
        if (!(size instanceof Size)) throw new TypeError();
        if (!(sheet instanceof SpriteSheet)) throw new TypeError();
        this.#picture = picture;
        this.#position = position;
        this.#size = size;
        this.#sheet = sheet;
    }

    draw(ctx, point) {
        if (!(ctx instanceof CanvasRenderingContext2D)) throw new TypeError();
        if (!(point instanceof Point)) throw new TypeError();
        if (!this.#picture.ready) throw new RangeError();
        ctx.drawImage(
            this.#picture.image,
            this.position.column * this.size.width,
            this.position.row * this.size.height,
            this.size.width,
            this.size.height,
            point.x,
            point.y,
            this.size.width,
            this.size.height
        );
    }

    get position() {
        return this.#position;
    }

    get size() {
        return this.#size;
    }

    drawTile(ctx, position) {
        if (!(ctx instanceof CanvasRenderingContext2D)) throw new TypeError();
        if (!(position instanceof BoardPosition)) throw new TypeError();
        this.draw(ctx, position.toPoint(this.size));
    }
}

class Cell {
    #position;
    #layers;

    constructor(position, layerCount) {
        if (!(position instanceof BoardPosition)) throw new TypeError();
        if (!isNum(layerCount)) throw new TypeError();
        if (layerCount <= 0) throw new RangeError();
        this.#position = position;
        this.#layers = [];
        for (let i = 0; i < layerCount; i++) {
            this.#layers.push(null);
        }
    }

    get position() {
        return this.#position;
    }

    get layerCount() {
        return this.#layers.length;
    }

    at(layer) {
        if (!isNum(layer)) throw new TypeError();
        if (layer < 0 || layer >= this.layerCount) throw new RangeError();
        return this.#layers[layer];
    }

    put(elem) {
        if (!(elem instanceof Element)) throw new TypeError();
        if (elem.layer < 0 || elem.layer >= this.layerCount) throw new RangeError();
        this.#layers[elem.layer] = elem;
    }

    remove(layer) {
        if (!isNum(layer)) throw new TypeError();
        if (layer < 0 || layer >= this.layerCount) throw new RangeError();
        this.#layers[layer] = null;
    }
}

class Element {
    #cell;
    #spriteColumnMaker;
    #layer;

    constructor(cell, spriteColumnMaker, layer) {
        if (!(cell instanceof Cell)) throw new TypeError();
        if (!(spriteColumnMaker instanceof Function)) throw new TypeError();
        if (!isNum(layer)) throw new TypeError();
        if (layer < 0 || layer >= cell.layerCount) throw new RangeError();
        this.#cell = cell;
        this.#spriteColumnMaker = spriteColumnMaker;
        this.#layer = layer;
    }

    get position() {
        return this.#cell.position;
    }

    get cell() {
        return this.#cell;
    }

    set cell(newValue) {
        if (!(newValue instanceof Cell)) throw new TypeError();
        this.#cell = newValue;
    }

    get layer() {
        return this.#layer;
    }

    draw(quadro, sheet, ctx) {
        if (!isNum(quadro)) throw new TypeError();
        if (!(sheet instanceof SpriteSheet)) throw new TypeError();
        if (!(ctx instanceof CanvasRenderingContext2D)) throw new TypeError();
        if (quadro < 0 || quadro >= sheet.rows) throw new RangeError();
        sheet.at(quadro, this.#spriteColumnMaker()).drawTile(ctx, this.position);
    }
}