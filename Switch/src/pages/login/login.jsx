import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './login.css';
import { guardarUsuario } from '../../api/auth'; // tu función para guardar en localStorage

export function LoginPage() {
  const [formData, setFormData] = useState({ identificador: '', contrasena: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Primero obtenemos la cookie CSRF de Sanctum
      await api.get('/sanctum/csrf-cookie');

      // Luego hacemos login
      const response = await api.post('/api/login', {
        email: formData.identificador,
        password: formData.contrasena,
      });

      // Guardamos usuario y token en localStorage
      const user = response.data.user; // { user: {...}, token: '...' }
      const token = response.data.token;

      guardarUsuario({ ...user, token }); // función de auth.js que guarda en localStorage

      alert(`Bienvenido ${user.name || user.nombre || ''}`);

      // Redirigimos según tipo de usuario
      if (user.Tipo_Usuario === 'Admin') {
        window.location.href = 'https://switchstyle.laravel.cloud/admin';
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="login-container">
      <div className="image-container-login">
        <img
          src="https://res.cloudinary.com/switchstyle/image/upload/v1756993827/login_myoobt.jpg"
          alt="Imagen"
          className="login-image"
        />
      </div>

      <div className="login-box">
        <div className="login-form">
          <h1 className="bienvenida">Ingresar</h1>
          <h3 className="bienvenido">Bienvenido de vuelta</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="identificador"
              placeholder="Email"
              required
              value={formData.identificador}
              onChange={handleChange}
              className="form-control input_user"
            />
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              required
              value={formData.contrasena}
              onChange={handleChange}
              className="form-control input_user"
            />
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="button-login">Ingresar</button>
            <p className="registro-link">
              ¿Todavía no estás registrado? <Link to="/registro">Regístrate aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
