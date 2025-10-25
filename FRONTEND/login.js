const API_URL_EMPLEADOS = 'http://localhost:9000/api/empleados';
(function(){
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');

  const API_BASE = 'http://localhost:9000/api';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    const login = document.getElementById('login').value.trim();
    const clave = document.getElementById('clave').value.trim();

    try {
      const resp = await axios.post(`${API_BASE}/auth/login`, { login, clave });
      const usuario = resp.data;
      // Guarda algo de info en localStorage si quieres usarlo luego
      localStorage.setItem('usuario', JSON.stringify(usuario));
      // Redirige a empleados.html (ajusta si quieres otra página)
      window.location.href = 'empleados.html';
    } catch (err) {
      const message = err?.response?.data?.mensaje || 'Error al iniciar sesión';
      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
    }
  });
})();