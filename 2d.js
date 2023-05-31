"use strict";

function isNum(value) {
    return typeof value === "number" && value === value && value !== Infinity && value !== -Infinity;
}

class Size {
    #width;
    #height;

    constructor(width, height) {
        if (!isNum(width) || !isNum(height)) throw new TypeError();
        if (width < 0 || height < 0) throw new RangeError();
        this.#width = width;
        this.#height = height;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    eq(that) {
        return this.width === that.width && this.height === that.height;
    }
}

class Point {
    #x;
    #y;

    constructor(x, y) {
        if (!isNum(x) || !isNum(y)) throw new TypeError();
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    eq(that) {
        return this.x === that.x && this.y === that.y;
    }
}

class Board {
    #rows;
    #columns;

    constructor(rows, columns) {
        if (!isNum(rows) || !isNum(columns)) throw new TypeError();
        if (rows < 0 || columns < 0) throw new RangeError();
        this.#rows = rows;
        this.#columns = columns;
    }

    get rows() {
        return this.#rows;
    }

    get columns() {
        return this.#columns;
    }

    eq(that) {
        return this.rows === that.rows && this.columns === that.columns;
    }

    randomPosition() {
        return this.at(Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.columns));
    }

    at(row, column) {
        if (!isNum(row) || !isNum(column)) throw new TypeError();
        if (row < 0 || row >= this.#rows || column < 0 || column >= this.#columns) throw new RangeError();
        return new BoardPosition(row, column, this);
    }
}

class BoardPosition {
    #row;
    #column;
    #board;

    constructor(row, column, board) {
        if (!isNum(row) || !isNum(column)) throw new TypeError();
        if (!(board instanceof Board)) throw new TypeError();
        if (row < 0 || column < 0) throw new RangeError();
        this.#row = row;
        this.#column = column;
        this.#board = board;
    }

    get row() {
        return this.#row;
    }

    get column() {
        return this.#column;
    }

    get board() {
        return this.#board;
    }

    toPoint(size) {
        return new Point(size.width * this.column, size.height * this.row);
    }

    eq(that) {
        return this.row === that.row && this.column === that.column && this.board === that.board;
    }

    get up() {
        return this.row === 0 ? null : this.board.at(this.row - 1, this.column);
    }

    get down() {
        return this.row === this.board.rows - 1 ? null : this.board.at(this.row + 1, this.column);
    }

    get left() {
        return this.column === 0 ? null : this.board.at(this.row, this.column - 1);
    }

    get right() {
        return this.column === this.board.columns - 1 ? null : this.board.at(this.row, this.column + 1);
    }

    get neighbours4() {
        return [this.up, this.down, this.left, this.right].filter(x => x !== null);
    }

    get neighbours8() {
        return [this.down.left, this.down, this.down.right, this.left, this.right, this.up.left, this.up, this.up.right].filter(x => x !== null);
    }
}