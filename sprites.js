"use strict";

function SpriteSheet(linhas, colunas, src, finished) {
  if (!this) return new SpriteSheet(linhas, colunas, src, finished);
  var imagem = new Image();
  imagem.src = src;
  var largura = -1;
  var altura = -1;
  var t = this;

  imagem.onload = function() {
    largura = imagem.width / colunas;
    altura = imagem.height / linhas;
    finished(t);
  };

  this.sprite = function(linha, coluna) {
    return function(ctx, x, y) {
      ctx.drawImage(imagem, coluna * largura, linha * altura, largura, altura, x, y, largura, altura);
    };
  };

  this.largura = function() {
      return largura;
  };

  this.altura = function() {
      return altura;
  };

  Object.freeze(this);
}

SpriteSheet.prototype = {};
Object.freeze(SpriteSheet.prototype);