"use strict";

var Modelo = (function() {

  var FUNCS = {
    direcoes: Object.freeze({
      SOBE: Object.freeze({}),
      DESCE: Object.freeze({}),
      DIREITA: Object.freeze({}),
      ESQUERDA: Object.freeze({})
    }),
    elementos: Object.freeze({
      BURACO: Object.freeze({}),
      OURO: Object.freeze({}),
      WUMPUS: Object.freeze({}),
      JOGADOR: Object.freeze({}),
      VAZIO: Object.freeze({})
    }),
    tiro: Object.freeze({
      ACERTOU: Object.freeze({}),
      ERROU: Object.freeze({}),
      NAO_PODE_ATIRAR: Object.freeze({})
    })
  };

  FUNCS.Mapa = function(largura, altura, buracos) {
    var mapa = {};
    var mapaBasico = [];
    var visivel = [];
    for (var i = 0; i < largura * altura; i++) {
      mapaBasico[i] = FUNCS.elementos.VAZIO;
      visivel[i] = false;
    }

    function valido(x, y) {
      return x >= 0 && x < largura && y >= 0 && y < altura;
    }

    function indice(x, y) {
      return y * largura + x;
    }

    function rx(indice) {
      return indice % largura;
    }

    function ry(indice) {
      return Math.floor(indice / largura);
    }

    var wumpusPos = -1;
    var jogadorPos = -1;
    var temFlecha = true;
    var fimJogo = FUNCS.elementos.VAZIO;
    var wumpusVivo = true;

    mapa.visivel = function(x, y) {
      return valido(x, y) && visivel[indice(x, y)];
    };

    function buracoIn(x, y) {
      return valido(x, y) && mapaBasico[indice(x, y)] === FUNCS.elementos.BURACO;
    }

    mapa.buraco = function(x, y) {
      return valido(x, y) && mapa.visivel(x, y) && buracoIn(x, y);
    };

    function wumpusIn(x, y) {
      return valido(x, y) && mapaBasico[indice(x, y)] === FUNCS.elementos.WUMPUS;
    }

    mapa.wumpus = function(x, y) {
      return valido(x, y) && mapa.visivel(x, y) && wumpusIn(x, y);
    };

    mapa.ouro = function(x, y) {
      return valido(x, y) && mapa.visivel(x, y) && mapaBasico[indice(x, y)] === FUNCS.elementos.OURO;
    };

    mapa.brisa = function(x, y) {
      return valido(x, y) && mapa.visivel(x, y) && (buracoIn(x - 1, y) || buracoIn(x + 1, y) || buracoIn(x, y - 1) || buracoIn(x, y + 1));
    };

    mapa.fedor = function(x, y) {
      return valido(x, y) && mapa.visivel(x, y) && (wumpusIn(x - 1, y) || wumpusIn(x + 1, y) || wumpusIn(x, y - 1) || wumpusIn(x, y + 1));
    };

    mapa.jogador = function(x, y) {
      return indice(x, y) === jogadorPos;
    };

    mapa.fim = function() {
      return fimJogo;
    };

    mapa.mover = function(direcao) {
      if (fimJogo !== FUNCS.elementos.VAZIO) return;
      var nx = rx(jogadorPos);
      var ny = ry(jogadorPos);
      if (direcao === FUNCS.direcoes.SOBE) {
        ny--;
      } else if (direcao === FUNCS.direcoes.DESCE) {
        ny++;
      } else if (direcao === FUNCS.direcoes.ESQUERDA) {
        nx--;
      } else if (direcao === FUNCS.direcoes.DIREITA) {
        nx++;
      } else {
        return;
      }
      if (!valido(nx, ny)) return;
      visivel[indice(nx, ny)] = true;
      if (mapa.buraco(nx, ny)) {
        fimJogo = FUNCS.elementos.BURACO;
        jogadorPos = -1;
      } else if (mapa.wumpus(nx, ny) && wumpusVivo) {
        fimJogo = FUNCS.elementos.WUMPUS;
        jogadorPos = -1;
      } else {
        jogadorPos = indice(nx, ny);
      }
      if (mapa.ouro(nx, ny)) fimJogo = FUNCS.elementos.OURO;
      return fimJogo;
    };

    mapa.atirar = function(direcao) {
      if (!temFlecha || fimJogo !== FUNCS.elementos.VAZIO) return FUNCS.tiro.NAO_PODE_ATIRAR;

      var jx = rx(jogadorPos);
      var jy = ry(jogadorPos);
      var wx = rx(wumpusPos);
      var wy = ry(wumpusPos);

      var matou = false;
      if (direcao === FUNCS.direcoes.SOBE) {
        if (jx === wx && jy > wy) matou = true;
      } else if (direcao === FUNCS.direcoes.DESCE) {
        if (jx === wx && jy < wy) matou = true;
      } else if (direcao === FUNCS.direcoes.ESQUERDA) {
        if (jx > wx && jy === wy) matou = true;
      } else if (direcao === FUNCS.direcoes.DIREITA) {
        if (jx < wx && jy === wy) matou = true;
      } else {
        return FUNCS.tiro.NAO_PODE_ATIRAR;
      }
      if (matou) wumpusVivo = false;
      temFlecha = false;
      return matou ? FUNCS.tiro.ACERTOU : FUNCS.tiro.ERROU;
    }

    mapa.altura = function() {
      return altura;
    };

    mapa.largura = function() {
      return largura;
    };

    mapa.temFlecha = function() {
      return temFlecha;
    };

    mapa.wumpusVivo = function() {
      return wumpusVivo;
    };

    for (var i = -3; i < buracos; i++) {
      var z, t;
      do {
        t = Math.floor(Math.random() * largura * altura);
        z = mapaBasico[t];
      } while (z != FUNCS.elementos.VAZIO);
      switch (i) {
        case -3:
          jogadorPos = t;
          z = FUNCS.elementos.JOGADOR;
          visivel[t] = true;
          break;
        case -2:
          wumpusPos = t;
          z = FUNCS.elementos.WUMPUS;
          break;
        case -1:
          z = FUNCS.elementos.OURO;
          break;
        default:
          z = FUNCS.elementos.BURACO;
          break;
      }
      mapaBasico[t] = z;
      z = FUNCS.elementos.VAZIO;
    }

    Object.freeze(mapa);
    return mapa;
  }

  Object.freeze(FUNCS);
  return FUNCS;
})();