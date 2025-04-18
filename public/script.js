// Botón de WhatsApp
const numeroBot = '5491163374826';
const mensajePredefinido = 'Hola Yanina! Quiero hacer una consulta';
const link = `https://wa.me/${numeroBot}?text=${encodeURIComponent(mensajePredefinido)}`;
document.getElementById('whatsappBtn').setAttribute('href', link);

// Cambio de tema claro/oscuro
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const temaGuardado = localStorage.getItem("tema") || "light";
  document.body.classList.add(temaGuardado);
  cargarTestimonios();
  actualizarCantidadTestimonios(); // 👈 contador en el título
});

// Función para cargar testimonios
function cargarTestimonios() {
  fetch('/api/testimonios')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('testimonios');
      container.innerHTML = '';
      data.forEach(t => {
        container.innerHTML += `
          <div class="testimonio">
            <p>"${t.mensaje}"</p>
            <span>- ${t.nombre}</span>
          </div>
        `;
      });
    })
    .catch(err => console.error('Error al cargar testimonios:', err));
}

// Función para mostrar cantidad total en el título
function actualizarCantidadTestimonios() {
  fetch('/api/testimonios/cantidad')
    .then(res => res.json())
    .then(data => {
      const titulo = document.getElementById('titulo-testimonios');
      titulo.textContent = `📣 Testimonios (${data.cantidad})`;
    })
    .catch(err => console.error('Error al obtener la cantidad:', err));
}

// Envío del formulario
document.getElementById('form-testimonio').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = e.target.nombre.value.trim();
  const mensaje = e.target.mensaje.value.trim();

  if (!nombre || !mensaje) {
    return alert('Por favor completá ambos campos.');
  }

  const res = await fetch('/api/testimonios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, mensaje })
  });

  if (res.ok) {
    alert('¡Gracias por tu testimonio!');
    e.target.reset();
    cargarTestimonios();
    actualizarCantidadTestimonios(); // 👈 actualizar contador
  } else {
    alert('Hubo un error al enviar el testimonio.');
  }
});

let paginaActual = 1;
const testimoniosPorPagina = 3;

// Cargar testimonios paginados
function cargarTestimonios() {
  fetch(`/api/testimonios?page=${paginaActual}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('testimonios');
      container.innerHTML = '';

      data.forEach(t => {
        container.innerHTML += `
          <div class="testimonio">
            <p>"${t.mensaje}"</p>
            <span>- ${t.nombre} (${t.fecha})</span>
          </div>
        `;
      });

      renderizarPaginacion();
    });
}

// Render paginación
function renderizarPaginacion() {
  fetch('/api/testimonios/cantidad')
    .then(res => res.json())
    .then(data => {
      const totalTestimonios = data.cantidad;
      const totalPaginas = Math.ceil(totalTestimonios / testimoniosPorPagina);

      const paginacion = document.getElementById('paginacion');
      paginacion.innerHTML = `
        <button ${paginaActual <= 1 ? 'disabled' : ''} onclick="cambiarPagina(-1)">⬅️ Anterior</button>
        Página ${paginaActual} de ${totalPaginas}
        <button ${paginaActual >= totalPaginas ? 'disabled' : ''} onclick="cambiarPagina(1)">Siguiente ➡️</button>
      `;
    });
}

// Cambio de página
function cambiarPagina(valor) {
  paginaActual += valor;
  cargarTestimonios();
}

document.getElementById('buscador-testimonios').addEventListener('input', () => {
  const texto = document.getElementById('buscador-testimonios').value.toLowerCase();
  const criterio = document.getElementById('criterio-busqueda').value;
  const testimonios = document.querySelectorAll('#testimonios .testimonio');

  testimonios.forEach(t => {
    const mensaje = t.querySelector('p')?.textContent.toLowerCase() || '';
    const nombre = t.querySelector('span')?.textContent.toLowerCase() || '';

    let coincide = false;
    if (criterio === 'todo') {
      coincide = mensaje.includes(texto) || nombre.includes(texto);
    } else if (criterio === 'nombre') {
      coincide = nombre.includes(texto);
    } else if (criterio === 'mensaje') {
      coincide = mensaje.includes(texto);
    }

    t.style.display = coincide ? 'block' : 'none';
  });
});
