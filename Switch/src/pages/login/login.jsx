import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { backendApi, setAuthToken } from "../../api/axios";
import { DataContext } from "../../context/DataContext.jsx";
import "./login.css";

export function LoginPage() {
  const [formData, setFormData] = useState({
    identificador: "",
    contrasena: "",
  });
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
      const response = await backendApi.post("/login", {
        email: formData.identificador.trim(),
        password: formData.contrasena.trim(),
      });

      const user = response.data.user;

      const usuarioNormalizado = {
        id: user.id,
        nombre: user.name || "Usuario",
        correo: user.email,
        rol: user.rol || "Usuario",
      };

      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);

      guardarUsuario(usuarioNormalizado);
      setUsuario(usuarioNormalizado);

      alert(`Bienvenido ${usuarioNormalizado.nombre}`);

      if (usuarioNormalizado.rol === "Admin") {
        window.location.href = "https://switchstyle.laravel.cloud/inicio";
      } else {
        navigate("/");
        setTimeout(() => window.location.reload(), 300);
      }

    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos.");
      } else {
        setError("Error inesperado.");
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
