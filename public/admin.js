// Mostrar/ocultar contraseña
document.getElementById('toggle-pass').addEventListener('click', () => {
  const passInput = document.getElementById('admin-pass');
  passInput.type = passInput.type === 'password' ? 'text' : 'password';
});

// Verificar si ya está logueado
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('adminAutenticado') === 'true') {
    mostrarPanelAdmin();
  }
});

// Acceso al panel con validación por backend
document.getElementById('login-btn').addEventListener('click', async () => {
  const user = document.getElementById('admin-user').value.trim().toLowerCase();
  const pass = document.getElementById('admin-pass').value;
  const error = document.getElementById('login-error');

  if (!user || !pass) {
    error.textContent = '⚠️ Completá ambos campos.';
    return;
  }

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: user, password: pass })
  });

  if (res.ok) {
    localStorage.setItem('adminAutenticado', 'true');
    mostrarPanelAdmin();
  } else {
    error.textContent = '❌ Usuario o contraseña incorrectos.';
    error.style.animation = 'none';
    void error.offsetWidth;
    error.style.animation = 'fadeIn 0.4s ease forwards';
  }
});

// Mostrar panel si el login fue exitoso
function mostrarPanelAdmin() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  cargarTestimoniosAdmin();
}

// Cargar testimonios en el panel admin
function cargarTestimoniosAdmin() {
  fetch('/api/testimonios/todos')
    .then(res => res.json())
    .then(testimonios => {
      const container = document.getElementById('admin-testimonios');
      container.innerHTML = '';
      testimonios.forEach(t => {
        const div = document.createElement('div');
        div.className = 'testimonio';
        div.innerHTML = `
          <p>"${t.mensaje}"</p>
          <span>- ${t.nombre} (${new Date(t.fecha).toLocaleDateString()})</span><br>
          <button class="btn-eliminar" onclick="eliminarTestimonio(${t.id})">🗑️ Eliminar</button>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('❌ Error al cargar testimonios:', err);
    });
}

// Eliminar testimonio
function eliminarTestimonio(id) {
  if (!confirm('¿Eliminar este testimonio?')) return;

  fetch(`/api/testimonios/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        alert('Testimonio eliminado ✅');
        cargarTestimoniosAdmin();
      } else {
        alert('Error al eliminar ❌');
      }
    });
}

// Cerrar sesión
document.getElementById('cerrar-sesion').addEventListener('click', () => {
  localStorage.removeItem('adminAutenticado');
  location.reload();
});
