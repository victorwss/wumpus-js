"use strict";

function desenhaModelo(modelo, spritesheet, ctx, quadro, especial) {
  var IDX_JOGADOR_COM_FLECHA = 0;
  var IDX_JOGADOR_SEM_FLECHA = 1;
  var IDX_WUMPUS_MORTO = 2;
  var IDX_WUMPUS_VIVO = 3;
  var IDX_BURACO = 4;
  var IDX_OURO = 5;
  var IDX_BRISA = 6;
  var IDX_FEDOR = 7;
  var IDX_INVISIVEL = 8;
  var IDX_VAZIO = 9;

  var w = modelo.largura();
  var h = modelo.altura();

  function sprites(x, y) {
    if (!modelo.visivel(x, y)) return [IDX_INVISIVEL];
    var sx = [IDX_VAZIO];
    if (modelo.buraco(x, y)) sx.push(IDX_BURACO);
    if (modelo.ouro(x, y)) sx.push(IDX_OURO);
    if (modelo.wumpus(x, y)) sx.push(modelo.wumpusVivo() ? IDX_WUMPUS_VIVO : IDX_WUMPUS_MORTO);
    if (modelo.jogador(x, y)) sx.push(modelo.temFlecha() ? IDX_JOGADOR_COM_FLECHA : IDX_JOGADOR_SEM_FLECHA);
    if (modelo.brisa(x, y)) sx.push(IDX_BRISA);
    if (modelo.fedor(x, y)) sx.push(IDX_FEDOR);
    return sx;
  }

  var sw = spritesheet.largura();
  var sh = spritesheet.altura();
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sx = sprites(x, y);
      for (var i in sx) {
        spritesheet.sprite(quadro, sx[i])(ctx, x * sw, y * sh);
      }
    }
  }

  var f = modelo.fim();

  var msg2 = f === Modelo.elementos.WUMPUS ? "Você virou comida de Wumpus!!!"
           : f === Modelo.elementos.BURACO ? "Cuidado com o BURAAAAAAACCCCCCCOOOOOOOOOOOOooooooooooo......."
           : f === Modelo.elementos.OURO ? "$$$ Você ficou milionário! $$$"
           : "Bem-vindo ao mundo de Wumpus. Encontre o ouro.";

  if (especial !== Modelo.tiro.NAO_PODE_ATIRAR || f !== Modelo.elementos.VAZIO) {
    ctx.save();
    try {
      ctx.fillStyle = especial === Modelo.tiro.ERROU ? "rgb(255,64,255)"
                    : especial === Modelo.tiro.ACERTOU ? "rgb(192,255,192)"
                    : f === Modelo.elementos.WUMPUS ? "rgb(255,224,192)"
                    : f === Modelo.elementos.BURACO ? "rgb(192,192,192)"
                    : f === Modelo.elementos.OURO ? "rgb(0,192,192)"
                    : "rgb(0,0,0)";

      var GAME_OVER = "\n\nGAME OVER!\nUse os botões abaixo para iniciar um novo jogo.";
      var WIN = "\n\nVocê ganhou.\nUse os botões abaixo para iniciar um novo jogo.";
      var CONTINUAR = "\n\nPressione ENTER para continuar";

      var msg1 = especial === Modelo.tiro.ERROU ? "Errou, OTÁÁÁÁÁÁÁÁÁÁÁRIO!\nAh, SE DEU MAL. HA HA HA HA HA..." + CONTINUAR
               : especial === Modelo.tiro.ACERTOU ? "PARABÉNS!!!!\nVOCÊ MATOU O WUMPUS!!!\nAgora só falta achar o ouro..." + CONTINUAR
               : f === Modelo.elementos.WUMPUS ? "O Wumpus achou você saboroso!\nHummmm... Que delícia!!!!\nVocê foi uma refeição muito apetitosa!" + GAME_OVER
               : f === Modelo.elementos.BURACO ? "De repente, você não sente mais o chão\nsob seus pés... E é uma pena que ainda\nnão revogaram a lei da gravidade!\n\nPois é, cara... Você se deu mal nessa, Mané!" + GAME_OVER
               : f === Modelo.elementos.OURO ? "VOCÊ ESTÁ RICO, MUITO RICO.\nPODRE DE RICO, MILIONÁRIO.\nYUHUUUUUU...\nPARABÉNS, CARA!" + WIN
               : "???";

      var msgSprite = especial === Modelo.tiro.ERROU ? IDX_JOGADOR_SEM_FLECHA
                    : especial === Modelo.tiro.ACERTOU ? IDX_WUMPUS_MORTO
                    : f === Modelo.elementos.WUMPUS ? IDX_WUMPUS_VIVO
                    : f === Modelo.elementos.BURACO ? IDX_BURACO
                    : f === Modelo.elementos.OURO ? IDX_OURO
                    : IDX_INVISIVEL;

      ctx.lineWidth = 1;
      ctx.lineCap = 'square';
      ctx.font = "16px serif";
      ctx.textBaseline = "hanging";

      var TAMANHO_FONTE = 16;
      var OFFSET_VERTICAL_FIGURA = 8;
      var MARGEM_INFERIOR_FIGURA = 10;
      var PADDING_INFERIOR = 4;
      var PADDING_ESQUERDA = 10;
      var PADDING_DIREITA = 10;
      var cw = w * sw / 2;
      var ch = h * sh / 2;

      var msga = msg1.split("\n");
      var ms = [];
      var msgw = sw;
      for (var i in msga) {
        var tw = Math.ceil(ctx.measureText(msga[i]).width);
        if (tw > msgw) msgw = tw;
        ms[i] = tw;
      }
      msgw += PADDING_ESQUERDA + PADDING_DIREITA;
      if (msgw % 2 !== 0) msgw++;
      var msgh = OFFSET_VERTICAL_FIGURA + sh + MARGEM_INFERIOR_FIGURA + PADDING_INFERIOR + msga.length * TAMANHO_FONTE;

      ctx.fillRect(cw - msgw / 2, ch - msgh / 2, msgw, msgh);
      ctx.strokeRect(cw - msgw / 2 + 0.5, ch - msgh / 2 + 0.5, msgw - 1, msgh - 1);
      spritesheet.sprite(quadro, msgSprite)(ctx, cw - sw / 2, ch - msgh / 2 + OFFSET_VERTICAL_FIGURA);

      ctx.fillStyle = "rgb(0,0,0)";
      for (var i in msga) {
        var tw = ctx.measureText(msga[i]).width;
        ctx.fillText(msga[i], Math.floor(cw - tw / 2), Math.floor(ch - msgh / 2 + OFFSET_VERTICAL_FIGURA + sh + MARGEM_INFERIOR_FIGURA + i * TAMANHO_FONTE));
      }
    } finally {
      ctx.restore();
    }
  }

  return msg2;
}