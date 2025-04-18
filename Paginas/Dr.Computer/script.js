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

// Consejos combinados para PC y Laptop
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
  "Si usas una Laptop, mantén siempre tu laptop sobre una superficie plana y dura para garantizar una adecuada ventilación.",
  "Si usas una Laptop, ajusta el brillo de la pantalla para ahorrar batería cuando estés trabajando sin conexión a la corriente.",
  "Si usas una Laptop, desactiva las funciones de retroiluminación del teclado si no las necesitas para extender la vida útil de la batería.",
  "Si usas una Laptop, evita llevarla en mochilas o bolsos sin protección para prevenir daños físicos en su estructura.",
  "Si usas una Laptop, configura el plan de energía para optimizar el rendimiento o ahorrar batería según lo necesites.",

  // Agrega más consejos combinados para PC y Laptop aquí...
];

// Función para mostrar un consejo aleatorio
function mostrarConsejo() {
  // Selecciona un consejo aleatorio de la lista combinada
  const consejo = consejos[Math.floor(Math.random() * consejos.length)];

  // Muestra el consejo en el contenedor
  document.getElementById("consejo-texto").textContent = consejo;

  // Muestra el contenedor de consejos
  document.getElementById("consejos-container").style.display = "block";
}

// Evento de clic para mostrar el consejo
document
  .getElementById("btn-consejos")
  .addEventListener("click", mostrarConsejo);
