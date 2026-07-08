function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

function toggleDropdown(event) {
  event.preventDefault();
  event.stopPropagation();
  const parent = event.currentTarget.closest(".dropdown");
  parent.classList.toggle("open");
  const arrow = event.currentTarget.querySelector(".arrow");
  if (arrow) {
    arrow.textContent = parent.classList.contains("open") ? "▼" : "▶";
  }
}

const consejos = [
  "Asegúrate de mantener tu sistema operativo actualizado para evitar problemas de seguridad.",
  "Siempre realiza mantenimiento preventivo con tu técnico de confianza cada cierto tiempo, esto hará que tenga un mejor rendimiento y prolongará su vida útil.",
  "Utiliza un software antivirus confiable para proteger tu equipo de amenazas.",
  "Organiza tus archivos regularmente para mejorar el rendimiento y evitar el desorden.",
  "Si usas una Laptop, asegúrate de desconectar la batería cuando no la estés usando por largos periodos para prolongar su vida.",
  "Si usas una Laptop, evita usarla sobre superficies blandas como camas o almohadas para evitar el sobrecalentamiento.",
  "Si usas una Laptop, es recomendable tener una base de refrigeración (cooler) para mejorar el rendimiento y evitar el sobrecalentamiento.",
  "Si usas una Laptop, siempre desconecta los dispositivos externos cuando no los necesites para ahorrar batería.",
  "Asegúrate de limpiar regularmente el polvo de tus perifericos para evitar que se desconpongan.",
  "Realiza copias de seguridad periódicas de tus archivos importantes para evitar pérdidas en caso de fallos.",
  "Instala solo programas de fuentes confiables para evitar la instalación de malware o software no deseado.",
  "Ajusta la resolución de tu pantalla para mejorar el rendimiento y la comodidad visual.",
  "Si usas una Laptop, cambia la pasta térmica cada 1-2 años para evitar sobrecalentamiento.",
  "Si tu PC enciende pero no da video, prueba limpiando la memoria RAM y las ranuras.",
  "Un disco SSD puede hacer que tu PC vieja se sienta como nueva. La actualización vale la pena.",
];

function mostrarConsejo() {
  const consejo = consejos[Math.floor(Math.random() * consejos.length)];
  document.getElementById("consejo-texto").textContent = consejo;
  document.getElementById("consejos-container").style.display = "block";
}

document
  .getElementById("btn-consejos")
  .addEventListener("click", mostrarConsejo);

const testimonios = [
  { texto: "Excelente servicio, mi laptop quedó como nueva. Muy recomendados.", autor: "Carlos G." },
  { texto: "Me armaron mi PC gamer con los componentes que les pedí. Quedó perfecta, gracias.", autor: "Miguel R." },
  { texto: "Rápidos y eficientes. Solucionaron mi problema de virus en menos de una hora.", autor: "Lucía M." },
  { texto: "El servicio a domicilio es súper práctico. Me atendieron en mi casa sin problema.", autor: "Ana P." },
  { texto: "Recuperaron todas mis fotos cuando pensé que las había perdido para siempre. Increíbles.", autor: "Pedro L." },
];

let testimonioIndex = 0;

function cambiarTestimonio(direccion) {
  testimonioIndex += direccion;
  if (testimonioIndex < 0) testimonioIndex = testimonios.length - 1;
  if (testimonioIndex >= testimonios.length) testimonioIndex = 0;
  const card = document.getElementById("testimonio-actual");
  card.querySelector(".testimonio-texto").textContent = `"${testimonios[testimonioIndex].texto}"`;
  card.querySelector(".testimonio-autor").textContent = `— ${testimonios[testimonioIndex].autor}`;
}

const blogArticulos = [
  {
    titulo: "¿Cada cuánto debo hacer mantenimiento a mi PC?",
    resumen: "El mantenimiento preventivo es clave para alargar la vida de tu equipo. Te contamos la frecuencia ideal según el uso.",
    link: "https://wa.me/51977842954?text=Hola,%20quiero%20saber%20más%20sobre%20mantenimiento%20preventivo"
  },
  {
    titulo: "HDD vs SSD: ¿Vale la pena el cambio?",
    resumen: "Migrar de disco duro a SSD es una de las mejores actualizaciones que puedes hacer. Aquí te explicamos por qué.",
    link: "https://wa.me/51977842954?text=Hola,%20quiero%20información%20sobre%20la%20migración%20a%20SSD"
  },
  {
    titulo: "Señales de que tu computadora tiene un virus",
    resumen: "Publicidad extraña, lentitud extrema y programas que no reconoces. Aprende a identificar infecciones de malware.",
    link: "https://wa.me/51977842954?text=Hola,%20creo%20que%20mi%20PC%20tiene%20virus,%20¿me%20pueden%20ayudar?"
  },
  {
    titulo: "¿Cuánta RAM necesita tu PC según tu uso?",
    resumen: "No todos necesitan 32GB. Te guiamos para elegir la cantidad ideal según tus tareas diarias.",
    link: "https://wa.me/51977842954?text=Hola,%20quiero%20asesoría%20para%20actualizar%20mi%20RAM"
  },
];

function renderBlog() {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;
  grid.innerHTML = blogArticulos.map(a => `
    <div class="blog-card">
      <h3>${a.titulo}</h3>
      <p>${a.resumen}</p>
      <a href="${a.link}" class="blog-btn" target="_blank">Consultar</a>
    </div>
  `).join("");
}

function calcularPresupuesto() {
  const checkboxes = document.querySelectorAll(".calculadora-servicios input[type=checkbox]");
  let total = 0;
  let servicios = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      total += parseInt(cb.dataset.precio);
      const label = cb.closest("label").textContent.trim();
      servicios.push(label.split(" — ")[0]);
    }
  });
  document.getElementById("total-presupuesto").textContent = `S/ ${total}`;
  const btn = document.getElementById("btn-cotizar-wa");
  if (servicios.length > 0) {
    const msg = `Hola, quiero cotizar los siguientes servicios: ${servicios.join(", ")}. Total estimado: S/${total}`;
    btn.href = `https://wa.me/51977842954?text=${encodeURIComponent(msg)}`;
  } else {
    btn.href = "#";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  renderBlog();

  const form = document.getElementById("contacto-form");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const nombre = document.getElementById("contacto-nombre").value.trim();
      const email = document.getElementById("contacto-email").value.trim();
      const mensaje = document.getElementById("contacto-mensaje").value.trim();
      let texto = `Hola, soy ${nombre}.`;
      if (email) texto += ` Mi correo es ${email}.`;
      texto += ` ${mensaje}`;
      window.open(`https://wa.me/51977842954?text=${encodeURIComponent(texto)}`, "_blank");
    });
  }
});
