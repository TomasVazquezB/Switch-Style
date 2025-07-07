import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import './Favoritos.css';

const Favoritos = () => {
    const [user, setUser] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [ropaFavorita, setRopaFavorita] = useState([]);
    const [accesoriosFavoritos, setAccesoriosFavoritos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const verificarSesion = async () => {
            try {
                // ⚠️ 1. CSRF Cookie (importante para que Laravel acepte la sesión)
                await api.get('/sanctum/csrf-cookie');

                // ⚠️ 2. Obtener usuario autenticado
                const res = await api.get('/api/user', { withCredentials: true });

                // Guardar usuario si autenticado
                if (res?.data?.id) {
                    setUser(res.data);
                } else {
                    throw new Error();
                }
            } catch {
                toast.warning("Debés iniciar sesión para ver tus favoritos");
                navigate('/login');
            }
        };

        verificarSesion();
    }, []);


    useEffect(() => {
        if (!user) return;

        const fetchFavoritos = async () => {
            try {
                const favoritosRes = await api.get('/api/favoritos');
                setFavoritos(favoritosRes.data);

                const [ropaRes, accRes] = await Promise.all([
                    api.get("/api/ropa"),
                    api.get("/api/accesorios")
                ]);

                const ropa = ropaRes.data.filter(p =>
                    favoritosRes.data.some(f => f.favoritable_type === 'App\\Models\\Ropa' && f.favoritable_id === p.id)
                );

                const accesorios = accRes.data.filter(p =>
                    favoritosRes.data.some(f => f.favoritable_type === 'App\\Models\\Accesorio' && f.favoritable_id === p.id)
                );

                const favoritosConId = favoritosRes.data.map(f => ({
                    ...f,
                    tipo: f.favoritable_type.includes('Ropa') ? 'ropa' : 'accesorio',
                }));

                ropa.forEach(p => {
                    const fav = favoritosConId.find(f => f.favoritable_id === p.id && f.tipo === 'ropa');
                    p.favorito_id = fav?.id;
                });

                accesorios.forEach(p => {
                    const fav = favoritosConId.find(f => f.favoritable_id === p.id && f.tipo === 'accesorio');
                    p.favorito_id = fav?.id;
                });

                setRopaFavorita(ropa);
                setAccesoriosFavoritos(accesorios);
            } catch (err) {
                toast.error("Error al cargar tus favoritos");
            }
        };

        fetchFavoritos();
    }, [user]);

    const handleQuitar = async (favoritoId) => {
        try {
            await api.delete(`/api/favoritos/${favoritoId}`);
            setFavoritos(prev => prev.filter(f => f.id !== favoritoId));
            setRopaFavorita(prev => prev.filter(p => p.favorito_id !== favoritoId));
            setAccesoriosFavoritos(prev => prev.filter(p => p.favorito_id !== favoritoId));
            toast.info("Producto quitado de favoritos 🤍");
        } catch {
            toast.error("No se pudo quitar el favorito");
        }
    };

    const renderTarjetas = (lista, tipo) => (
        <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">{tipo === 'ropa' ? 'Ropa' : 'Accesorios'}</h3>
            <div className="favoritos-page-grid">
                {lista.map(producto => (
                    <div key={producto.id} className="favoritos-page-card">
                        <Link to={`/producto/${tipo}/${producto.id}`}>
                            <img
                                src={`http://localhost:8000/storage/${producto.imagenes?.[0]?.ruta}`}
                                alt={producto.titulo}
                            />
                            <div className="favoritos-page-info">
                                <h4 className="favoritos-page-title">{producto.titulo}</h4>
                                <p className="favoritos-page-price">
                                    ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </Link>

                        <button
                            onClick={() => handleQuitar(producto.favorito_id)}
                            className="favoritos-page-remove"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="none"
                                className="w-5 h-5"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                                 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
                                 4.5 2.09C13.09 3.81 14.76 3 16.5 
                                 3 19.58 3 22 5.42 22 8.5c0 
                                 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            Quitar de favoritos
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="favoritos-page">
            <h2 className="favoritos-page-title-main">Mis Favoritos</h2>
            <hr className="mb-6" />

            {(ropaFavorita.length === 0 && accesoriosFavoritos.length === 0) ? (
                <p className="text-gray-600">No tenés productos favoritos aún.</p>
            ) : (
                <>
                    {ropaFavorita.length > 0 && renderTarjetas(ropaFavorita, 'ropa')}
                    {accesoriosFavoritos.length > 0 && (
                        <>
                            <br /><hr className="mb-6" /><br />
                            {renderTarjetas(accesoriosFavoritos, 'accesorio')}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Favoritos;
