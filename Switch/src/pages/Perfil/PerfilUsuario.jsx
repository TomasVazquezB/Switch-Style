import React, { useEffect, useState } from 'react';
import './perfil.css';

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) setUsuario(JSON.parse(data));
  }, []);

  if (!usuario) return <p className="cargando">Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <img src="/default-avatar.png" alt="Avatar" className="avatar" />
          <div>
            <h2>Hola{usuario.nombre}</h2>
            <p className="tipo">Tipo de cuenta:{usuario.rol}</p>
          </div>
        </div>

        <hr/>

        <div className="perfil-info">
          <p><strong>📧 Email:</strong> {usuario.correo}</p>
          <p><strong>👤 Nombre:</strong> {usuario.nombre}</p>
        </div>

        <hr/>

        <div className="perfil-links">
          <button onClick={() => window.location.href = '/pedidos'}>🧾 Mis pedidos</button>
          <button onClick={() => window.location.href = '/favoritos'}>❤️ Mis favoritos</button>
          <button onClick={() => window.location.href = '/faq'}>❓ Preguntas Frecuentes</button>
        </div>

        <hr/>

        <button className="cerrar-sesion" onClick={() => {
          localStorage.removeItem('usuario');
          localStorage.removeItem('isLoggedIn');
          window.location.href = '/';
        }}>Cerrar sesión </button>
      </div>
    </div>
  );
};

export default PerfilUsuario;