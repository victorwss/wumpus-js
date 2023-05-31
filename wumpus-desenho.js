"use strict";

function desenharModelo(modelo, spritesheet, ctx, quadro, especial) {
    if (!(modelo instanceof Mapa)) throw new TypeError();
    if (!(spritesheet instanceof SpriteSheet)) throw new TypeError();
    if (!(ctx instanceof CanvasRenderingContext2D)) throw new TypeError();
    if (typeof quadro !== "bigint") throw new TypeError();
    if (!(especial instanceof Tiro)) throw new TypeError();

    const q = Number(quadro % 4n);
    const PRETO = "rgb(0,0,0)";
    const CIANO_FOSCO = "rgb(0,192,192)";
    const CINZA_CLARO = "rgb(192,192,192)";
    const LARANJA_CLARO = "rgb(255,224,192)";
    const VERDE_CLARO = "rgb(192,255,192)";
    const MAGENTA_MEIO_CLARO = "rgb(255,64,255)";

    const w = modelo.board.columns;
    const h = modelo.board.rows;
    const sw = spritesheet.spriteSize.width;
    const sh = spritesheet.spriteSize.height;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const cell = modelo.cell(modelo.board.at(x, y));
            for (let z = 0; z < cell.layerCount; z++) {
                cell.at(z)?.draw(q, spritesheet, ctx);
            }
        }
    }

    const f = modelo.fim;

    if (especial !== Tiro.NAO_PODE_ATIRAR || f) {
        ctx.save();
        try {
            ctx.fillStyle = especial === Tiro.ERROU ? MAGENTA_MEIO_CLARO
                          : especial === Tiro.ACERTOU ? VERDE_CLARO
                          : f instanceof Wumpus ? LARANJA_CLARO
                          : f instanceof Buraco ? CINZA_CLARO
                          : f instanceof Ouro ? CIANO_FOSCO
                          : PRETO;

            const GAME_OVER = "\n\nGAME OVER!\nUse os botões abaixo para iniciar um novo jogo.";
            const WIN = "\n\nVocê ganhou.\nUse os botões abaixo para iniciar um novo jogo.";
            const CONTINUAR = "\n\nPressione ENTER para continuar";

            const msg1 = especial === Tiro.ERROU ? "Errou, OTÁÁÁÁÁÁÁÁÁÁÁRIO!\nAh, SE DEU MAL. HA HA HA HA HA..." + CONTINUAR
                       : especial === Tiro.ACERTOU ? "PARABÉNS!!!!\nVOCÊ MATOU O WUMPUS!!!\nAgora só falta achar o ouro..." + CONTINUAR
                       : f instanceof Wumpus ? "O Wumpus achou você saboroso!\nHummmm... Que delícia!!!!\nVocê foi uma refeição muito apetitosa!" + GAME_OVER
                       : f instanceof Buraco ? "De repente, você não sente mais o chão\nsob seus pés... E é uma pena que ainda\nnão revogaram a lei da gravidade!\n\nPois é, cara... Você se deu mal nessa, Mané!" + GAME_OVER
                       : f instanceof Ouro ? "VOCÊ ESTÁ RICO, MUITO RICO.\nPODRE DE RICO, MILIONÁRIO.\nYUHUUUUUU...\nPARABÉNS, CARA!" + WIN
                       : "???";

            const msgSprite = especial === Tiro.ERROU ? IDX_JOGADOR_SEM_FLECHA
                            : especial === Tiro.ACERTOU ? IDX_WUMPUS_MORTO
                            : f instanceof Wumpus ? IDX_WUMPUS_VIVO
                            : f instanceof Buraco ? IDX_BURACO
                            : f instanceof Ouro ? IDX_OURO
                            : IDX_INVISIVEL;

            ctx.lineWidth = 1;
            ctx.lineCap = "square";
            ctx.font = "16px serif";
            ctx.textBaseline = "hanging";

            const TAMANHO_FONTE = 16;
            const OFFSET_VERTICAL_FIGURA = 8;
            const MARGEM_INFERIOR_FIGURA = 10;
            const PADDING_INFERIOR = 4;
            const PADDING_ESQUERDA = 10;
            const PADDING_DIREITA = 10;
            const cw = w * sw / 2;
            const ch = h * sh / 2;

            const msga = msg1.split("\n");
            const ms = [];
            let msgw = sw;
            for (const parte of msga) {
                const tw = Math.ceil(ctx.measureText(parte).width);
                if (tw > msgw) msgw = tw;
                ms.push(tw);
            }
            msgw += PADDING_ESQUERDA + PADDING_DIREITA;
            if (msgw % 2 !== 0) msgw++;
            const msgh = OFFSET_VERTICAL_FIGURA + sh + MARGEM_INFERIOR_FIGURA + PADDING_INFERIOR + msga.length * TAMANHO_FONTE;

            ctx.fillRect(cw - msgw / 2, ch - msgh / 2, msgw, msgh);
            ctx.strokeRect(cw - msgw / 2 + 0.5, ch - msgh / 2 + 0.5, msgw - 1, msgh - 1);
            spritesheet.at(q, msgSprite).draw(ctx, new Point(cw - sw / 2, ch - msgh / 2 + OFFSET_VERTICAL_FIGURA));

            ctx.fillStyle = PRETO;
            for (let i in msga) {
                const parte = msga[i];
                const tw = ctx.measureText(parte).width;
                ctx.fillText(parte, Math.floor(cw - tw / 2), Math.floor(ch - msgh / 2 + OFFSET_VERTICAL_FIGURA + sh + MARGEM_INFERIOR_FIGURA + i * TAMANHO_FONTE));
            }
        } finally {
            ctx.restore();
        }
    }

    return f instanceof Wumpus ? "Você virou comida de Wumpus!!!"
         : f instanceof Buraco ? "Cuidado com o BURAAAAAAACCCCCCCOOOOOOOOOOOOooooooooooo......."
         : f instanceof Ouro ? "$$$ Você ficou milionário! $$$"
         : "Bem-vindo ao mundo de Wumpus. Encontre o ouro.";
}