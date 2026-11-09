/* ==================================================================
   Flores para Anais — lógica de la página
   ------------------------------------------------------------------
   1. Portada: al pulsar el botón se desbloquea el audio (los navegadores
      bloquean el autoplay), arranca la escena y comienza la experiencia.
   2. Mensajes: aparecen y desaparecen sincronizados con la canción.
   3. Pétalos: se generan al azar para dar profundidad.
   ================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Ajustes rápidos
     ------------------------------------------------------------------ */

  // Cada mensaje aparece en el segundo indicado y se queda hasta que
  // empieza el siguiente (con una pequeña pausa para que respire).
  // La canción "enigmatica-edit" dura 1:24 (84,5 s). El último mensaje
  // entra al terminarse la canción, justo cuando arranca el cierre.
  var MENSAJES = [
    { t: 4,    texto: "Para ti, Anais." },
    { t: 9.5,  texto: "Hay regalos que se compran… y otros que se cultivan." },
    { t: 16.5, texto: "Estas flores no se marchitan: crecen cada vez que pienso en ti." },
    { t: 24,   texto: "Gracias por llegar a mi vida" },
    { t: 29.5, texto: "y por quedarte incluso sabiendo el desastre que soy." },
    { t: 36.5, texto: "Tu sonrisa es mi lugar favorito." },
    { t: 42,   texto: "Y si algún día dudas de cuánto te quiero, vuelve aquí y míralas crecer otra vez." },
    { t: 50,   texto: "No hace falta un día especial para recordarte lo mucho que significas para mí." },
    { t: 58,   texto: "Te elegiría una," },
    { t: 62.5, texto: "y otra vez," },
    { t: 66.5, texto: "y todas las veces." },
    { t: 71,   texto: "Estas flores son tuyas: hoy, mañana y siempre." },
    { t: 77.5, texto: "Con todo mi cariño," },
    { t: 84,   texto: "Brayan 🌻" }
  ];

  // Paletas de color (se definen en css/style.css). La escena va cambiando
  // de una a otra mientras suena la canción.
  // 5 tramos de 16,9 s cubren la canción (84,5 s) y el cierre entra
  // justo con el último color (atardecer), que se queda hasta el final.
  var PALETAS = ["amarillo", "rosa", "lila", "luna", "hielo", "atardecer"];
  var SEGUNDOS_POR_PALETA = 16.9;

  var PAUSA_ENTRE_MENSAJES = 1.4; // segundos de silencio antes del siguiente
  var VOLUMEN = 0.8;

  /* ------------------------------------------------------------------
     Referencias
     ------------------------------------------------------------------ */

  var body = document.body;
  var audio = document.getElementById("musica");
  var cierre = document.getElementById("cierre");
  var lyrics = document.getElementById("lyrics");
  var btnEmpezar = document.getElementById("btn-empezar");
  var btnAudio = document.getElementById("btn-audio");
  var intro = document.getElementById("intro");
  var contenedorPetalos = document.getElementById("petalos");
  var destello = document.getElementById("destello");

  /* ------------------------------------------------------------------
     Estado
     ------------------------------------------------------------------ */

  var iniciado = false;
  var enCierre = false;
  var indiceActual = -1;
  var indicePaleta = -1;
  var temporizador = null;
  var aviso = null;

  // El audio es el reloj: cargar o pausar no adelanta mensajes ni colores.
  function ahora() {
    return enCierre ? Math.max(audio.currentTime, 84.5) + cierre.currentTime : audio.currentTime;
  }

  function mostrarAviso(texto) {
    if (!aviso) {
      aviso = document.createElement("p");
      aviso.className = "aviso";
      aviso.setAttribute("role", "status");
      document.body.appendChild(aviso);
    }
    aviso.textContent = texto;
    aviso.hidden = false;
  }

  function ocultarAviso() {
    if (aviso) {
      aviso.hidden = true;
    }
  }

  /* ------------------------------------------------------------------
     Paletas de color
     ------------------------------------------------------------------ */

  function destellar() {
    if (!destello) {
      return;
    }

    destello.classList.remove("activo");
    // Fuerza el reinicio de la animación aunque el cambio sea seguido.
    void destello.offsetWidth;
    destello.classList.add("activo");
  }

  function actualizarPaleta(t) {
    var tramo = Math.floor(t / SEGUNDOS_POR_PALETA);

    // El último tramo (atardecer) se queda hasta el final del cierre.
    if (tramo > PALETAS.length - 1) {
      tramo = PALETAS.length - 1;
    }

    if (tramo === indicePaleta) {
      return;
    }

    var primeraVez = indicePaleta === -1;
    indicePaleta = tramo;
    body.setAttribute("data-paleta", PALETAS[tramo]);

    if (!primeraVez) {
      destellar();
    }
  }

  /* ------------------------------------------------------------------
     Pétalos
     ------------------------------------------------------------------ */

  function crearPetalos(cantidad) {
    if (!contenedorPetalos || !document.createDocumentFragment) {
      return;
    }

    var fragmento = document.createDocumentFragment();

    for (var i = 0; i < cantidad; i++) {
      var petalo = document.createElement("span");
      petalo.className = "petalo";
      petalo.style.left = (Math.random() * 100).toFixed(2) + "%";
      petalo.style.setProperty("--s", (6 + Math.random() * 8).toFixed(1) + "px");
      petalo.style.setProperty("--dur", (10 + Math.random() * 9).toFixed(1) + "s");
      // Un retardo negativo hace que ya estén cayendo al empezar.
      petalo.style.setProperty("--delay", (-Math.random() * 14).toFixed(1) + "s");
      petalo.style.setProperty("--deriva", (Math.random() * 24 - 12).toFixed(1) + "vw");
      petalo.style.setProperty("--giro", (180 + Math.random() * 360).toFixed(0) + "deg");
      fragmento.appendChild(petalo);
    }

    contenedorPetalos.appendChild(fragmento);
  }

  /* ------------------------------------------------------------------
     Mensajes
     ------------------------------------------------------------------ */

  function finalDe(indice) {
    if (indice + 1 < MENSAJES.length) {
      return MENSAJES[indice + 1].t - PAUSA_ENTRE_MENSAJES;
    }
    // El último mensaje ("Brayan 🌻") se queda hasta el final del cierre.
    return Infinity;
  }

  function actualizarMensajes() {
    if (document.getElementById("lectura").open) return;
    var t = ahora();

    actualizarPaleta(t);

    var indice = -1;

    for (var i = 0; i < MENSAJES.length; i++) {
      if (t >= MENSAJES[i].t && t < finalDe(i)) {
        indice = i;
        break;
      }
    }

    if (indice === indiceActual) {
      return;
    }

    indiceActual = indice;

    if (indice === -1) {
      lyrics.classList.remove("visible");
      return;
    }

    lyrics.textContent = MENSAJES[indice].texto;
    lyrics.classList.add("visible");
    // Disponible al llegar al último mensaje de la dedicatoria.
    if (indice === MENSAJES.length - 1) {
      btnLeer.hidden = false;
      document.querySelector(".titulo").classList.add("visible");
    }
  }

  /* ------------------------------------------------------------------
     Audio
     ------------------------------------------------------------------ */

  function reflejarEstadoAudio() {
    var pausado = audioActivo().paused;
    body.classList.toggle("audio-pausado", pausado);
    btnAudio.classList.toggle("pausado", pausado);
    btnAudio.setAttribute("aria-label", pausado ? "Reanudar la música" : "Pausar la música");
    btnAudio.setAttribute("title", pausado ? "Reanudar la música" : "Pausar la música");
  }

  // Devuelve el audio que suena ahora mismo (la canción o el cierre).
  function audioActivo() {
    return enCierre && cierre ? cierre : audio;
  }

  function intentarReproducir() {
    audio.volume = VOLUMEN;

    var promesa = audio.play();

    if (promesa && typeof promesa.then === "function") {
      promesa.catch(function () {
        // El navegador no dejó sonar la música (o el archivo no cargó).
        // La escena espera al audio para mantener la sincronización.
        mostrarAviso("La música no pudo iniciar. Pulsa ♪ para intentarlo de nuevo.");
        reflejarEstadoAudio();
      });
    }
  }

  function reproducirCierre() {
    cierre.volume = VOLUMEN;
    Promise.resolve(cierre.play()).then(function () {
      ocultarAviso();
      reflejarEstadoAudio();
    }).catch(function () {
      mostrarAviso("El cierre no pudo sonar. Pulsa el botón de música para intentarlo de nuevo.");
      reflejarEstadoAudio();
    });
  }

  function iniciarCierre() {
    if (enCierre || !cierre) return;
    enCierre = true;
    actualizarMensajes();
    reproducirCierre();
  }

  function alternarAudio() {
    var activo = audioActivo();

    if (activo.paused) {
      if (enCierre) {
        reproducirCierre();
      } else {
        intentarReproducir();
      }
    } else {
      audio.pause();
      if (cierre) {
        cierre.pause();
      }
    }

    reflejarEstadoAudio();
  }

  /* ------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------ */

  function iniciar() {
    if (iniciado) {
      return;
    }
    iniciado = true;

    // 1) La escena deja de estar congelada y la portada se desvanece.
    body.classList.remove("precarga");
    body.classList.add("iniciado");
    intro.setAttribute("aria-hidden", "true");
    intro.inert = true;

    // 2) Música (aprovechando el clic del usuario).
    btnAudio.hidden = false;
    document.getElementById("btn-reiniciar").hidden = false;
    intentarReproducir();

    // 3) Mensajes y pétalos.
    temporizador = window.setInterval(actualizarMensajes, 200);
    actualizarMensajes();
    crearPetalos(26);
  }

  /* ------------------------------------------------------------------
     Eventos
     ------------------------------------------------------------------ */


  // Lectura completa: audio independiente para conservar el punto de la escena.
  var lectura = document.getElementById("lectura");
  var musicaLectura = document.getElementById("musica-lectura");
  var btnLeer = document.getElementById("btn-leer");
  var avisoLectura = document.getElementById("lectura-aviso");
  var reanudarEscena = false;
  var mensajesLectura = document.getElementById("lectura-mensajes");
  MENSAJES.forEach(function (mensaje) {
    var parrafo = document.createElement("p");
    parrafo.textContent = mensaje.texto;
    mensajesLectura.appendChild(parrafo);
  });

  btnLeer.addEventListener("click", function () {
    reanudarEscena = !audioActivo().paused && !audioActivo().ended;
    audio.pause();
    if (cierre) cierre.pause();
    ocultarAviso();
    lectura.showModal();
    lectura.scrollTop = 0;
    musicaLectura.currentTime = 0;
    musicaLectura.volume = VOLUMEN;
    musicaLectura.loop = false;
    avisoLectura.hidden = true;
    Promise.resolve(musicaLectura.play()).catch(function () {
      if (lectura.open) avisoLectura.hidden = false;
    });
  });
  document.getElementById("btn-volver").addEventListener("click", function () {
    lectura.close();
  });
  lectura.addEventListener("close", function () {
    musicaLectura.pause();
    musicaLectura.currentTime = 0;
    btnLeer.focus();
    if (reanudarEscena) {
      if (enCierre) reproducirCierre();
      else intentarReproducir();
    }
  });
  musicaLectura.addEventListener("playing", function () { avisoLectura.hidden = true; });
  musicaLectura.addEventListener("error", function () { avisoLectura.hidden = false; });

  // Retardos escalonados para el brillo de "Hola, Anais".
  var letras = document.querySelectorAll(".intro__saludo > span");
  for (var i = 0; i < letras.length; i++) {
    letras[i].style.setProperty("--i", i);
  }

  btnEmpezar.addEventListener("click", iniciar);

  btnAudio.addEventListener("click", alternarAudio);
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    audio.pause();
    if (cierre) cierre.pause();
    window.location.reload();
  });

  audio.addEventListener("play", function () {
    ocultarAviso();
    reflejarEstadoAudio();
  });

  audio.addEventListener("pause", function () {
    reflejarEstadoAudio();
  });

  audio.addEventListener("ended", iniciarCierre);

  audio.addEventListener("error", function () {
    mostrarAviso("No se encontró el archivo de música (sound/enigmatica-edit.mp3).");
  });

  if (cierre) {
    cierre.addEventListener("play", function () {
      ocultarAviso();
      reflejarEstadoAudio();
    });

    cierre.addEventListener("pause", function () {
      reflejarEstadoAudio();
    });

    cierre.addEventListener("error", function () {
      mostrarAviso("No se encontró el cierre (sound/enigmatica-edit-fin.mp3).");
    });
  }

  // Si el usuario cambia de pestaña, no hace falta hacer nada especial:
  // los mensajes y colores siguen el tiempo real del audio.

  window.addEventListener("beforeunload", function () {
    if (temporizador) {
      window.clearInterval(temporizador);
    }
  });
})();
