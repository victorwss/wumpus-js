"use strict";

const IDX_JOGADOR_COM_FLECHA = 0;
const IDX_JOGADOR_SEM_FLECHA = 1;
const IDX_WUMPUS_MORTO = 2;
const IDX_WUMPUS_VIVO = 3;
const IDX_BURACO = 4;
const IDX_OURO = 5;
const IDX_BRISA = 6;
const IDX_FEDOR = 7;
const IDX_INVISIVEL = 8;
const IDX_VAZIO = 9;

const CAMADA_CHAO = 0;
const CAMADA_BURACO = 1;
const CAMADA_WUMPUS = 1;
const CAMADA_OURO = 1;
const CAMADA_JOGADOR = 2;
const CAMADA_BRISA = 3;
const CAMADA_FEDOR = 4;
const CAMADA_MISTERIO = 5;
const TOTAL_CAMADAS = 6;

class Buraco extends Element {
    constructor(cell) {
        super(cell, () => IDX_BURACO, CAMADA_BURACO);
    }
}

class Ouro extends Element {
    constructor(cell) {
        super(cell, () => IDX_OURO, CAMADA_OURO);
    }
}

class Wumpus extends Element {
    #vivo = true;

    constructor(cell) {
        super(cell, () => this.vivo ? IDX_WUMPUS_VIVO : IDX_WUMPUS_MORTO, CAMADA_WUMPUS);
    }

    get vivo() {
        return this.#vivo;
    }

    matar() {
        this.#vivo = false;
    }
}

class Jogador extends Element {
    #temFlecha;

    constructor(cell) {
        super(cell, () => this.temFlecha ? IDX_JOGADOR_COM_FLECHA : IDX_JOGADOR_SEM_FLECHA, CAMADA_JOGADOR);
        this.#temFlecha = true;
    }

    get temFlecha() {
        return this.#temFlecha;
    }

    atirou() {
        this.#temFlecha = false;
    }
}

class Brisa extends Element {
    constructor(cell) {
        super(cell, () => IDX_BRISA, CAMADA_BRISA);
    }
}

class Fedor extends Element {
    constructor(cell) {
        super(cell, () => IDX_FEDOR, CAMADA_FEDOR);
    }
}

class Invisivel extends Element {
    constructor(cell) {
        super(cell, () => IDX_INVISIVEL, CAMADA_MISTERIO);
    }
}

class Vazio extends Element {
    constructor(cell) {
        super(cell, () => IDX_VAZIO, CAMADA_CHAO);
    }
}

class Direcao {
    static SOBE = new Direcao();
    static DESCE = new Direcao();
    static DIREITA = new Direcao();
    static ESQUERDA = new Direcao();
    static values() {
        return [Direcao.SOBE, Direcao.DESCE, Direcao.DIREITA, Direcao.ESQUERDA];
    }
}

class Tiro {
    static ACERTOU = new Tiro();
    static ERROU = new Tiro();
    static NAO_PODE_ATIRAR = new Tiro();
    static values() {
        return [Tiro.ACERTOU, Tiro.ERROU, Tiro.NAO_PODE_ATIRAR];
    }
}

class Mapa {

    #wumpus;
    #jogador;
    #ouro;
    #fimJogo = undefined;
    #board;
    #buracos;
    #mapaBasico;

    constructor(rows, columns, buracos) {
        if (!isNum(rows) || !isNum(columns) || !isNum(buracos)) throw new TypeError();
        if (rows <= 0 || columns <= 0 || buracos <= 0)  throw new RangeError();
        const board = new Board(rows, columns);
        const mapa = {};
        this.#mapaBasico = [];

        for (let i = 0; i < board.rows; i++) {
            const linha = [];
            this.#mapaBasico.push(linha);
            for (let j = 0; j < board.columns; j++) {
                const cell = new Cell(board.at(i, j), TOTAL_CAMADAS);
                cell.put(new Vazio(cell));
                cell.put(new Invisivel(cell));
                linha.push(cell);
            }
        }

        this.#board = board;
        this.#buracos = buracos;

        for (let i = -3; i < buracos; i++) {
            let c;
            do {
                c = this.cell(board.randomPosition());
            } while (c.at(CAMADA_OURO) || c.at(CAMADA_WUMPUS) || c.at(CAMADA_JOGADOR) || c.at(CAMADA_BURACO));
            switch (i) {
                case -3:
                    this.#jogador = new Jogador(c);
                    c.put(this.#jogador);
                    c.remove(CAMADA_MISTERIO);
                    break;
                case -2:
                    this.#wumpus = new Wumpus(c);
                    c.put(this.#wumpus);
                    for (const q of c.position.neighbours4) {
                        if (this.#valido(q)) this.cell(q).put(new Fedor(this.cell(q)));
                    }
                    break;
                case -1:
                    this.#ouro = new Ouro(c);
                    c.put(this.#ouro);
                    break;
                default:
                    c.put(new Buraco(c));
                    for (const q of c.position.neighbours4) {
                        if (this.#valido(q)) this.cell(q).put(new Brisa(this.cell(q)));
                    }
                    break;
            }
        }
        Object.seal(this);
    }

    cell(p) {
        if (!(p instanceof BoardPosition)) throw new TypeError();
        return this.#mapaBasico[p.row][p.column];
    }

    #colocar(elem, p) {
        if (!(elem instanceof Element)) throw new TypeError();
        if (!(p instanceof BoardPosition)) throw new TypeError();
        this.cell(p).push(elem);
    }

    #revelar(p) {
        if (!(p instanceof BoardPosition)) throw new TypeError();
        if (!this.#valido(p)) throw new RangeError();
        this.cell(p).remove(CAMADA_MISTERIO);
    }

    #valido(place) {
        if (!(place instanceof BoardPosition)) throw new TypeError();
        return place !== null && place.column >= 0 && place.column < this.#board.columns && place.row >= 0 && place.row < this.#board.rows;
    }

    buraco(place) {
        if (!(place instanceof BoardPosition)) throw new TypeError();
        return this.#valido(place) && this.cell(place).at(CAMADA_BURACO) instanceof Buraco;
    }

    wumpus(place) {
        if (!(place instanceof BoardPosition)) throw new TypeError();
        return this.#valido(place) && this.cell(place).at(CAMADA_WUMPUS) instanceof Wumpus;
    }

    ouro(place) {
        if (!(place instanceof BoardPosition)) throw new TypeError();
        return this.#ouro.position.eq(place);
    }

    get fim() {
        return this.#fimJogo;
    }

    get board() {
        return this.#board;
    }

    get temFlecha() {
        return this.#jogador && this.#jogador.temFlecha;
    }

    get wumpusVivo() {
        return this.#wumpus.vivo;
    }

    mover(direcao) {
        if (!(direcao instanceof Direcao)) throw new TypeError();

        if (this.fim || !this.#jogador) return;

        const op = this.#jogador.position;
        const np = direcao === Direcao.SOBE ? op.up
                : direcao === Direcao.DESCE ? op.down
                : direcao === Direcao.ESQUERDA ? op.left
                : direcao === Direcao.DIREITA ? op.right
                : op;
        if (op === np || !this.#valido(np)) return;
        this.#revelar(np);
        this.cell(op).remove(CAMADA_JOGADOR);
        if (this.buraco(np)) {
            this.#fimJogo = this.cell(np).at(CAMADA_BURACO);
            this.#jogador = undefined;
        } else if (this.wumpus(np) && this.#wumpus.vivo) {
            this.#fimJogo = this.#wumpus;
            this.#jogador = undefined;
        } else {
            this.#jogador.cell = this.cell(np);
            this.cell(np).put(this.#jogador);
            if (this.ouro(np)) this.#fimJogo = this.#ouro;
        }
        return this.#fimJogo;
    }

    atirar(direcao) {
        if (!(direcao instanceof Direcao)) throw new TypeError();

        if (!this.#jogador || !this.temFlecha || this.#fimJogo) return Tiro.NAO_PODE_ATIRAR;

        const jx = this.#jogador.position.column;
        const jy = this.#jogador.position.row;
        const wx = this.#wumpus.position.column;
        const wy = this.#wumpus.position.row;

        let acertou = (direcao === Direcao.SOBE     && jx === wx && jy >   wy)
                   || (direcao === Direcao.DESCE    && jx === wx && jy <   wy)
                   || (direcao === Direcao.ESQUERDA && jx >   wx && jy === wy)
                   || (direcao === Direcao.DIREITA  && jx <   wx && jy === wy);

        this.#jogador.atirou();
        if (acertou) this.#wumpus.matar();
        return acertou ? Tiro.ACERTOU : Tiro.ERROU;
    }
}