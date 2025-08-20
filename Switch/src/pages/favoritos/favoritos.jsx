import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './favoritos.css';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [ropaFavorita, setRopaFavorita] = useState([]);
    const [accesoriosFavoritos, setAccesoriosFavoritos] = useState([]);

    useEffect(() => {
        const fav = JSON.parse(localStorage.getItem('favoritos')) || [];
        setFavoritos(fav);

        const fetchFavoritos = async () => {
            try {
                const [ropaRes, accRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/ropa"),
                    axios.get("http://localhost:8000/api/accesorios")
                ]);
                setRopaFavorita(ropaRes.data.filter(p => fav.includes(p.id)));
                setAccesoriosFavoritos(accRes.data.filter(p => fav.includes(p.id)));
            } catch (err) {toast.error("Error al cargar favoritos");
            }
        };
        fetchFavoritos();
    }, []);

    const handleQuitar = (id) => {
        const nuevos = favoritos.filter(f => f !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevos));
        setFavoritos(nuevos);
        setRopaFavorita(prev => prev.filter(p => p.id !== id));
        setAccesoriosFavoritos(prev => prev.filter(p => p.id !== id));
        toast.info("Producto quitado de favoritos 🤍");
    };

    const renderTarjetas = (lista, tipo) => (
        <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">{tipo === 'ropa' ? 'Ropa' : 'Accesorios'}</h3>
            <div className="favoritos-page-grid">
                {lista.map(producto => (
                    <div key={producto.id} className="favoritos-page-card">
                        <Link to={`/producto/${tipo}/${producto.id}`}>
                            <img src={`http://localhost:8000/storage/${producto.imagenes?.[0]?.ruta}`} alt={producto.titulo}/>
                            <div className="favoritos-page-info">
                                <h4 className="favoritos-page-title">{producto.titulo}</h4>
                                <p className="favoritos-page-price"> ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </Link>
                        <button onClick={() => handleQuitar(producto.id)} className="favoritos-page-remove">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="none" className="w-5 h-5">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>Quitar de favoritos</button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="favoritos-page">
            <h2 className="favoritos-page-title-main">Mis Favoritos</h2>
            <hr className="mb-6" />
            {favoritos.length === 0 ? (<p className="text-gray-600">No tenés productos favoritos aún</p>) : (
                <>
                    {ropaFavorita.length > 0 && renderTarjetas(ropaFavorita, 'ropa')}
                    <br></br>
                    <hr className="mb-6" />
                    <br></br>
                    {accesoriosFavoritos.length > 0 && renderTarjetas(accesoriosFavoritos, 'accesorio')}
                </>
            )}
        </div>
    );
};

export default Favoritos;