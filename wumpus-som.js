"use strict";

var Som = (function(undefined) {
  var RESULTADO = {};

  RESULTADO.Musicas = function(m) {
    var musicas = [];
    var musica = undefined;
    var proxima;

    var t = {
      stop: function() {
        if (!musica) return;
        musica.pause();
        musica.currentTime = 0;
        musica = undefined;
      },
      play: function() {
        t.stop();
        var m = musica;
        do {
          m = musicas[Math.floor(Math.random() * musicas.length)];
        } while (m === musica);
        musica = m;
        musica.volume = 0.8;
        musica.play();
      }
    };

    for (var i in m) {
      var a = new Audio();
      musicas[i] = a;
      a.src = m[i];
      a.load();
      a.addEventListener("ended", t.play);
    }

    Object.freeze(t);
    return t;
  };

  RESULTADO.Sons = function(s) {
    var sons = [];
    for (var i in s) {
      sons[i] = new Audio();
      sons[i].src = s[i];
      sons[i].load();
    }

    var t = {
      play: function(i) {
        var s = sons[i];
        if (s) s.play();
      }
    };

    Object.freeze(t);
    return t;
  };

  Object.freeze(RESULTADO);
  return RESULTADO;
})();