// ============================
// CONFIGURACION EMAILJS
// ============================
// 1. Crea cuenta en https://www.emailjs.com/
// 2. Crea un Email Service.
// 3. Crea un Email Template.
// 4. Cambia estos valores por los tuyos.


const EMAILJS_PUBLIC_KEY = "cvQWJ9zBBGdo94Gib";
const EMAILJS_SERVICE_ID = "service_lli0nyn";
const EMAILJS_TEMPLATE_ID = "template_8xmyjhk";

emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
});
// ============================
// ELEMENTOS
// ============================

const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const botonesInicio = document.getElementById("botonesInicio");
const mensajePrincipal = document.getElementById("mensajePrincipal");
const formCita = document.getElementById("formCita");
const canvas = document.getElementById("heart");

// ============================
// BOTON NO SE ESCAPA
// ============================

function moverBotonNo() {
  const card = document.getElementById("cuadroDialogo");
  const cardRect = card.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();

  const maxX = cardRect.width - btnRect.width - 20;
  const maxY = cardRect.height - btnRect.height - 20;

  const nuevaX = Math.random() * maxX - maxX / 2;
  const nuevaY = Math.random() * maxY - maxY / 2;

  btnNo.style.transform = `translate(${nuevaX}px, ${nuevaY}px)`;
}

btnNo.addEventListener("mouseover", moverBotonNo);

btnNo.addEventListener("mouseenter", moverBotonNo);

btnNo.addEventListener("touchstart", function (e) {
  e.preventDefault();
  moverBotonNo();
});

btnNo.addEventListener("click", function (e) {
  e.preventDefault();
  moverBotonNo();
});

// ============================
// BOTON SI
// ============================

btnSi.addEventListener("click", function () {
  Swal.fire({
    title: "Sabía que dirías que sí jsjsjs",
    text: "Ahora solo falta escoger el plan.",
    icon: "success",
    showConfirmButton: false,
    timer: 1800,
  });

  mensajePrincipal.textContent = "Perfecto, en unos minutos me llegarán tus respuestas.";
  botonesInicio.classList.add("oculto");
  formCita.classList.remove("oculto");

  iniciarCorazones();
});

// ============================
// ENVIO DEL FORMULARIO
// ============================

formCita.addEventListener("submit", function (e) {
  e.preventDefault();

  const dia = document.getElementById("dia").value;
  const plan = document.getElementById("plan").value;
  const comentario = document.getElementById("comentario").value.trim();

  if (!dia || !plan) {
    Swal.fire({
      title: "Falta algo",
      text: "Selecciona el día y el plan.",
      icon: "warning",
      confirmButtonColor: "#2f2a28",
    });
    return;
  }

  const datosCorreo = {
    nombre: "Dayra",
    dia: dia,
    plan: plan,
    comentario: comentario || "Sin comentario",
    fecha_envio: new Date().toLocaleString(),
  };

  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, datosCorreo)
    .then(function () {
      Swal.fire({
        title: "Respuesta enviada",
        text: "Listo, ya quedó guardado nuestro plan.",
        icon: "success",
        confirmButtonColor: "#2f2a28",
      });

      formCita.innerHTML = `
        <p class="mensaje-final">
          <br>
          Ya tengo tu respuesta. Ahora me toca organizar algo bonito.
        </p>
      `;
    })
    .catch(function (error) {
      console.error("Error al enviar correo:", error);

      Swal.fire({
        title: "No se pudo enviar",
        text: "Hubo un problema enviando la respuesta. Intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#2f2a28",
      });
    });
});

// ============================
// CORAZONES DE FONDO
// ============================

function iniciarCorazones() {
  canvas.classList.add("activo");

  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const hearts = [];

  for (let i = 0; i < 35; i++) {
    hearts.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 8,
      speed: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 20, size / 20);
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.bezierCurveTo(-12, -5, -20, 8, 0, 20);
    ctx.bezierCurveTo(20, 8, 12, -5, 0, 6);
    ctx.fillStyle = `rgba(120, 80, 80, ${opacity})`;
    ctx.fill();
    ctx.restore();
  }

  function animar() {
    ctx.clearRect(0, 0, width, height);

    hearts.forEach(function (heart) {
      drawHeart(heart.x, heart.y, heart.size, heart.opacity);

      heart.y -= heart.speed;

      if (heart.y < -30) {
        heart.y = height + 30;
        heart.x = Math.random() * width;
      }
    });

    requestAnimationFrame(animar);
  }

  animar();
}