// src/pages/Favoritos.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendApi as axios } from '../../api/axios';
import './favoritos.css';

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial" font-size="24" fill="#9ca3af">Sin imagen</text></svg>`
  );

function toBucketUrl(rawPath) {
  const BUCKET_BASE = (import.meta.env.VITE_ASSETS_BASE || "").replace(/\/+$/, "");
  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
        <rect width='100%' height='100%' fill='#f3f4f6'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
          font-family='Arial' font-size='24' fill='#9ca3af'>Sin imagen</text>
      </svg>`
    );

  if (!rawPath) return PLACEHOLDER;

  // Si ya es una URL completa
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  // Limpieza de path
  let key = String(rawPath)
    .replace(/^https?:\/\/[^/]+\/?/, "")
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  // Arma la URL final desde el bucket
  return BUCKET_BASE ? `${BUCKET_BASE}/${encodeURI(key)}` : PLACEHOLDER;
}


const Favoritos = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [ropaFavorita, setRopaFavorita] = useState([]);
  const [accesoriosFavoritos, setAccesoriosFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ Nuevo flag para carga segura

  // 🔒 Verificar login y token al montar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('usuario')) || null;

    if (!storedUser) {
      toast.warning("Debes iniciar sesión para ver tus favoritos 🔐", { autoClose: 4000 });
      const timeout = setTimeout(() => navigate('/login'), 4000);
      setLoading(false);
      return () => clearTimeout(timeout);
    }

    setUsuario(storedUser);

    const cargarFavoritos = async () => {
      const fav = JSON.parse(localStorage.getItem('favoritos')) || [];
      setFavoritos(fav);

      try {
        const [ropaRes, accRes] = await Promise.all([
          axios.get('/api/ropa'),
          axios.get('/api/accesorios')
        ]);

        const ropaFav = ropaRes.data.filter(p => fav.includes(p.id));
        const accFav = accRes.data.filter(p => fav.includes(p.id));

        setRopaFavorita(ropaFav);
        setAccesoriosFavoritos(accFav);
      } catch (err) {
        toast.error("Error al cargar productos favoritos 😞");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarFavoritos();
  }, [navigate]);

  const handleQuitar = (id) => {
    const nuevos = favoritos.filter(f => f !== id);
    localStorage.setItem('favoritos', JSON.stringify(nuevos));
    setFavoritos(nuevos);
    setRopaFavorita(prev => prev.filter(p => p.id !== id));
    setAccesoriosFavoritos(prev => prev.filter(p => p.id !== id));
    toast.info("Producto quitado de favoritos 🤍");
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="favoritos-page text-center mt-16">
        <h2 className="favoritos-2">Favoritos</h2>
        <p className="text-gray-500 text-lg">Verificando tu sesión...</p>
      </div>
    );
  }

  // Usuario no logueado
  if (!usuario) {
    return (
      <div className="favoritos-page text-center mt-16">
        <h2 className="favoritos-2">Favoritos</h2>
        <p className="text-gray-600 text-lg">Debes iniciar sesión para ver tus productos favoritos</p>
        <p className="text-gray-500 mt-4">Serás redirigido automáticamente al inicio de sesión en unos segundos...</p>
        <Link to="/login"></Link>
      </div>
    );
  }

  const renderTarjetas = (lista, tipo) => (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-4">{tipo === 'ropa' ? 'Ropa' : 'Accesorios'}</h3>
      <div className="favoritos-page-grid">
        {lista.map(producto => {
          const raw = producto.imagen_url || producto.ruta_imagen || producto?.imagenes?.[0]?.ruta || "";
          const imageUrl = toBucketUrl(raw);

          return (
            <div key={producto.id} className="favoritos-page-card">
              <Link to={`/producto/${tipo}/${producto.id}`}>
                <img src={imageUrl} alt={producto.titulo} onError={(e) => e.target.src = PLACEHOLDER} />
                <div className="favoritos-page-info">
                  <h4 className="favoritos-page-title">{producto.titulo}</h4>
                  <p className="favoritos-page-price">
                    ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </Link>
              <button onClick={() => handleQuitar(producto.id)} className="favoritos-page-remove">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                  viewBox="0 0 24 24" stroke="none" className="w-5 h-5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                            2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                            C13.09 3.81 14.76 3 16.5 3
                            19.58 3 22 5.42 22 8.5
                            c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Quitar de favoritos
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="favoritos-page">
      <h2 className="favoritos-page-title-main">Mis Favoritos</h2>
      <hr className="mb-6" />
      {favoritos.length === 0 ? (
        <p className="text-gray-600">No tenés productos favoritos aún</p>
      ) : (
        <>
          {ropaFavorita.length > 0 && renderTarjetas(ropaFavorita, 'ropa')}
          <br />
          <hr className="mb-6" />
          <br />
          {accesoriosFavoritos.length > 0 && renderTarjetas(accesoriosFavoritos, 'accesorio')}
        </>
      )}
    </div>
  );
};

export default Favoritos;
