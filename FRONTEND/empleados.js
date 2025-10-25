// ============================================
// FRONTEND - Empleados (Axios + HTML standalone)
// ============================================

const API_URL_EMPLEADOS = 'http://localhost:9000/api/empleados';
let empleadoAEliminar = null;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error);
    mostrarError('Error de conexión con el backend. Verifica que esté ejecutándose en http://localhost:9000');
    return Promise.reject(error);
  }
);

window.addEventListener('DOMContentLoaded', () => {
  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
    // Si no hay sesión, redirige al login
    window.location.href = 'login.html';
    return;
  }
  cargarEmpleados();
  configurarFormulario();
  configurarBuscador();
});

function configurarFormulario() {
  const form = document.getElementById('empleado-form');
  form.addEventListener('submit', guardarEmpleado);
}

function configurarBuscador() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') buscarEmpleados();
  });
}

async function cargarEmpleados() {
  mostrarLoading(true);
  ocultarError();
  try {
    const response = await axios.get(API_URL_EMPLEADOS);
    mostrarEmpleados(response.data);
  } catch (error) {
    mostrarError('No se pudieron cargar los empleados.');
  } finally {
    mostrarLoading(false);
  }
}

function mostrarEmpleados(empleados) {
  const container = document.getElementById('empleados-container');
  if (!empleados || empleados.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👨‍💼</div>
        <h3>No hay empleados registrados</h3>
        <p>Agrega tu primer empleado usando el formulario de arriba</p>
      </div>`;
    return;
  }

  const html = empleados.map(e => `
    <div class="producto-card">
      <div class="producto-header">
        <div>
          <div class="producto-nombre">${escapeHtml(e.nombre)} ${escapeHtml(e.apellido)}</div>
          <div class="producto-descripcion">${escapeHtml(e.email)}</div>
        </div>
        <span class="producto-id">ID: ${e.id}</span>
      </div>
      <div class="producto-details">
        <div class="detail-item">
          <div class="detail-label">Salario</div>
          <div class="detail-value">$${parseFloat(e.salario).toFixed(2)}</div>
        </div>
      </div>
      <div class="producto-actions">
        <button class="btn btn-warning" onclick="editarEmpleado(${e.id})">✏️ Editar</button>
        <button class="btn btn-danger" onclick="abrirModalEliminar(${e.id})">🗑️ Eliminar</button>
      </div>
    </div>`).join('');

  container.innerHTML = `<div class="productos-grid">${html}</div>`;
}

async function guardarEmpleado(event) {
  event.preventDefault();
  const id = document.getElementById('empleado-id').value;
  const empleado = {
    nombre: document.getElementById('nombre').value.trim(),
    apellido: document.getElementById('apellido').value.trim(),
    email: document.getElementById('email').value.trim(),
    salario: parseFloat(document.getElementById('salario').value)
  };

  if (!empleado.nombre || empleado.nombre.length < 2) return mostrarError('El nombre debe tener al menos 2 caracteres');
  if (!empleado.apellido || empleado.apellido.length < 2) return mostrarError('El apellido debe tener al menos 2 caracteres');
  if (!empleado.email || !empleado.email.includes('@')) return mostrarError('Debe ingresar un email válido');
  if (!empleado.salario || empleado.salario <= 0) return mostrarError('El salario debe ser mayor que 0');

  try {
    if (id) {
      await axios.put(`${API_URL_EMPLEADOS}/${id}`, empleado);
      mostrarMensajeExito('✅ Empleado actualizado correctamente');
    } else {
      await axios.post(API_URL_EMPLEADOS, empleado);
      mostrarMensajeExito('✅ Empleado creado correctamente');
    }
    limpiarFormulario();
    cargarEmpleados();
  } catch (error) {
    if (error.response && error.response.data) {
      const errores = error.response.data;
      if (typeof errores === 'object') {
        const mensajesError = Object.entries(errores).map(([campo, mensaje]) => `${campo}: ${mensaje}`).join('\n');
        mostrarError(mensajesError);
      } else {
        mostrarError(errores);
      }
    } else {
      mostrarError('Error al guardar el empleado.');
    }
  }
}

async function editarEmpleado(id) {
  try {
    const response = await axios.get(`${API_URL_EMPLEADOS}/${id}`);
    const e = response.data;
    document.getElementById('empleado-id').value = e.id;
    document.getElementById('nombre').value = e.nombre;
    document.getElementById('apellido').value = e.apellido;
    document.getElementById('email').value = e.email;
    document.getElementById('salario').value = e.salario;
    document.getElementById('form-title').textContent = '✏️ Editar Empleado';
    document.getElementById('btn-text').textContent = '💾 Actualizar Empleado';
    document.getElementById('btn-cancel').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    mostrarError('No se pudo cargar el empleado para editar');
  }
}

function abrirModalEliminar(id) {
  empleadoAEliminar = id;
  document.getElementById('modal-confirmacion').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal-confirmacion').style.display = 'none';
  empleadoAEliminar = null;
}

async function confirmarEliminar() {
  if (!empleadoAEliminar) return;
  try {
    await axios.delete(`${API_URL_EMPLEADOS}/${empleadoAEliminar}`);
    mostrarMensajeExito('🗑️ Empleado eliminado');
    cargarEmpleados();
  } catch (error) {
    mostrarError('No se pudo eliminar el empleado');
  } finally {
    cerrarModal();
  }
}

async function buscarEmpleados() {
  const termino = document.getElementById('search-input').value.trim();
  if (!termino) return cargarEmpleados();
  mostrarLoading(true);
  try {
    const response = await axios.get(`${API_URL_EMPLEADOS}/buscar`, { params: { nombre: termino } });
    mostrarEmpleados(response.data);
  } catch (error) {
    mostrarError('Error al buscar empleados');
  } finally {
    mostrarLoading(false);
  }
}

function cancelarEdicion() { limpiarFormulario(); }

function limpiarFormulario() {
  document.getElementById('empleado-id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('apellido').value = '';
  document.getElementById('email').value = '';
  document.getElementById('salario').value = '';
  document.getElementById('form-title').textContent = '➕ Agregar Nuevo Empleado';
  document.getElementById('btn-text').textContent = '💾 Guardar Empleado';
  document.getElementById('btn-cancel').style.display = 'none';
}

function mostrarLoading(mostrar) { document.getElementById('loading').style.display = mostrar ? 'block' : 'none'; }
function mostrarError(mensaje) { const e = document.getElementById('error-message'); e.textContent = mensaje; e.style.display = 'block'; }
function ocultarError() { const e = document.getElementById('error-message'); e.textContent = ''; e.style.display = 'none'; }
function mostrarMensajeExito(mensaje) {
  const banner = document.createElement('div'); banner.className = 'success-banner'; banner.textContent = mensaje;
  document.body.appendChild(banner); setTimeout(() => banner.remove(), 2000);
}
function escapeHtml(text) {
  if (text == null) return ''; return text.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
}