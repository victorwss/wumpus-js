"use strict";

var Controller = (function() {

  function IntVar(nomeVar, valorInicial, label, btMais, btMenos) {
    var valor = valorInicial;
    var listener = function(v) { return v; };

    var up = function() {
      listener(valor);
      label.innerHTML = nomeVar + ": " + valor;
    };

    var ca = function() {
      valor = listener(valor + 1);
      up();
    };
    btMais.onclick = ca;

    var cb = function() {
      valor = listener(valor - 1);
      up();
    };
    btMenos.onclick = cb;

    up();

    var x = {
      valor: function() {
        return valor;
      },
      defineListener: function(callback) {
        listener = callback;
      },
      definirValor: function(novoValor) {
        valor = novoValor;
        up();
      },
      atualizar: up
    };
    Object.freeze(x);
    return x;
  }

  function BoolVar(nomeLigar, nomeDesligar, valorInicial, bt) {
    var valor = valorInicial;
    var listener = function(v) { return v; };

    var up = function() {
      valor = listener(valor);
      bt.innerHTML = valor ? nomeDesligar : nomeLigar;
    };

    var c = function() {
      valor = listener(!valor);
      bt.innerHTML = valor ? nomeDesligar : nomeLigar;
    };
    bt.onclick = c;

    up();

    var x = {
      valor: function() {
        return valor;
      },
      defineListener: function(callback) {
        listener = callback;
      },
      definirValor: function(novoValor) {
        valor = novoValor;
        up();
      },
      atualizar: up
    };
    Object.freeze(x);
    return x;
  }

  function Config(doc, subtitulo, btRecomecar, canvas, varLargura, varAltura, varBuracos, varSom, varMusica) {
    var teclado = Teclado.criar(doc);
    var f = {
      teclado: teclado,
      canvas: function() {
        return canvas;
      },
      varAltura: varAltura,
      varLargura: varLargura,
      varBuracos: varBuracos,
      varMusica: varMusica,
      varSom: varSom,
      subtitulo: function(texto) {
        var c = subtitulo.innerHTML;
        if (c !== texto) subtitulo.innerHTML = texto;
      },
      aoRecomecar: function(f) {
        btRecomecar.onclick = f;
      }
    };
    Object.freeze(f);
    return f;
  }

  function MapaController(cfgs, spritesheet) {
    var modelo, especial;
    var canvas = cfgs.canvas();
    var agora = new Date().getTime();
    var acumulado = 0;
    var quadro = 0;
    var teclado = cfgs.teclado;
    var b = browser();
    var ext = b === 'IE' || b === 'Edge' || b === 'Safari' ? 'mp3' : 'ogg';
    var musicas = Som.Musicas(['./menwork.' + ext, './sugar.' + ext, './madly.' + ext, './mambo5.' + ext, './danceq.' + ext]);
    var sons = Som.Sons({
      "acertou": "./urro." + ext,
      "errou": "./fhaha1." + ext,
      "buraco": "./nooo." + ext,
      "wumpus": "./comeu." + ext,
      "ouro": "./woohoo1." + ext
    });

    var novoJogo = function(evt) {
      especial = Modelo.tiro.NAO_PODE_ATIRAR;
      var w = cfgs.varLargura.valor();
      var h = cfgs.varAltura.valor();
      var b2 = cfgs.varBuracos.valor();
      var bm = Math.floor(w * h / 9);
      var b3 = b2 < 4 ? 4 : b2 > bm ? bm : b2;
      cfgs.varBuracos.definirValor(b3);
      modelo = Modelo.Mapa(w, h, b3);
      canvas.width = spritesheet.largura() * w;
      canvas.height = spritesheet.altura() * h;
      if (cfgs.varMusica.valor()) musicas.play();
    };
    cfgs.aoRecomecar(novoJogo);
    var criarNovo = true;

    function clamp(min, mid, max) {
      return mid < min ? min : mid > max ? max : mid;
    }

    function novaLargura(t) {
      var t2 = cfgs.varLargura.valor();
      var t3 = clamp(8, t, 20);
      if (t3 !== t2) criarNovo = true;
      return t3;
    }

    function novaAltura(t) {
      var t2 = cfgs.varAltura.valor();
      var t3 = clamp(8, t, 20);
      if (t3 !== t2) criarNovo = true;
      return t3;
    }

    function novosBuracos(t) {
      var t2 = cfgs.varLargura.valor() * cfgs.varAltura.valor();
      var t3 = clamp(4, t, Math.floor(t2 / 9));
      if (t3 !== t2) criarNovo = true;
      return t3;
    }

    function trocaMusica(t) {
      if (t) {
        musicas.play();
      } else {
        musicas.stop();
      }
      return t;
    }

    console.log(cfgs);
    cfgs.varLargura.defineListener(novaLargura);
    cfgs.varAltura.defineListener(novaAltura);
    cfgs.varBuracos.defineListener(novosBuracos);
    cfgs.varMusica.defineListener(trocaMusica);

    function movimento(direcao) {
      return (function() {
        if (especial !== Modelo.tiro.NAO_PODE_ATIRAR) return;
        var resultado = teclado.pressionada([Teclado.KEY_SHIFT, Teclado.KEY_CTRL, Teclado.KEY_ALT])
                      ? (especial = modelo.atirar(direcao))
                      : modelo.mover(direcao);
        if (!cfgs.varSom.valor()) return;
        var som = resultado === Modelo.tiro.ACERTOU ? "acertou"
                : resultado === Modelo.tiro.ERROU ? "errou"
                : resultado === Modelo.elementos.BURACO ? "buraco"
                : resultado === Modelo.elementos.WUMPUS ? "wumpus"
                : resultado === Modelo.elementos.OURO ? "ouro"
                : null;
        sons.play(som);
      });
    }

    teclado.aoPressionar([Teclado.KEY_LEFT,  Teclado.KEY_NUMPAD_4, Teclado.KEY_A], movimento(Modelo.direcoes.ESQUERDA));
    teclado.aoPressionar([Teclado.KEY_RIGHT, Teclado.KEY_NUMPAD_6, Teclado.KEY_D], movimento(Modelo.direcoes.DIREITA ));
    teclado.aoPressionar([Teclado.KEY_UP,    Teclado.KEY_NUMPAD_8, Teclado.KEY_W], movimento(Modelo.direcoes.SOBE    ));
    teclado.aoPressionar([Teclado.KEY_DOWN,  Teclado.KEY_NUMPAD_2, Teclado.KEY_S], movimento(Modelo.direcoes.DESCE   ));
    teclado.aoPressionar([Teclado.KEY_ENTER], function() {
      especial = Modelo.tiro.NAO_PODE_ATIRAR;
    });

    function ciclo() {
      if (criarNovo) {
        novoJogo();
        //console.log("w=" + modelo.largura() + ",h=" + modelo.altura());
        criarNovo = false;
      }
      var anterior = agora;
      agora = new Date().getTime();
      var decorrido = agora - anterior;
      acumulado += decorrido;
      while (acumulado > 250) {
        acumulado -= 250;
        quadro++;
        quadro %= 4;
      }

      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var w = modelo.largura();
      var h = modelo.altura();

      var msg = desenhaModelo(modelo, spritesheet, ctx, quadro, especial);
      cfgs.subtitulo(msg);
      requestAnimationFrame(ciclo);
    }
    requestAnimationFrame(ciclo);
  };

  var f = {
    intVar: IntVar,
    boolVar: BoolVar,
    cfg: Config,
    run: MapaController
  };
  Object.freeze(f);
  return f;
})();