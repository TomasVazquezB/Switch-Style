import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { csrf } from "../../api/axios";
import { DataContext } from "../../context/DataContext.jsx";
import "./login.css";

export function LoginPage() {
  const [formData, setFormData] = useState({ identificador: "", contrasena: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUsuario } = useContext(DataContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1️⃣ Obtener cookie CSRF antes de hacer login
      await csrf();

      // 2️⃣ Enviar la solicitud de login
      const response = await api.post(
        "/login",
        {
          email: formData.identificador.trim(),
          password: formData.contrasena.trim(),
        },
        {
          withCredentials: true, // 🔑 para enviar cookies CSRF
        }
      );

      // 3️⃣ Guardar datos del usuario
      const user = response.data.user || response.data;
      localStorage.setItem("usuario", JSON.stringify(user));
      setUsuario(user);

      alert(`Bienvenido ${user.Nombre || user.name || ""}`);

      // 4️⃣ Redirigir según el rol del usuario
      if (user.Tipo_Usuario === "Admin") {
        window.location.href = "https://switchstyle.laravel.cloud/admin";
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);

      if (err.response?.status === 419) {
        setError("Error de sesión (CSRF). Refresca la página e inténtalo otra vez.");
      } else if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos.");
      } else if (err.response?.status === 422) {
        setError("Por favor completa todos los campos correctamente.");
      } else {
        setError(err.response?.data?.message || "Error inesperado al iniciar sesión.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="image-container-login">
        <img
          src="https://res.cloudinary.com/switchstyle/image/upload/v1756993827/login_myoobt.jpg"
          alt="Imagen de inicio de sesión"
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

            <button type="submit" className="button-login">
              Ingresar
            </button>

            <p className="registro-link">
              ¿Todavía no estás registrado?{" "}
              <Link to="/registro">Regístrate aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}