import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductoItem from '../../components/Productoitem/ProductoItem';

const Busqueda = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('q');

    const [resultados, setResultados] = useState([]);
    const [favoritos, setFavoritos] = useState(() => {const stored = localStorage.getItem("favoritos");
        return stored ? JSON.parse(stored) : [];
    });

    const toggleFavorito = (id) => {
        setFavoritos((prev) => {let nuevos;
            if (prev.includes(id)) {nuevos = prev.filter((favId) => favId !== id);
            } else {nuevos = [...prev, id];
            }
            localStorage.setItem("favoritos", JSON.stringify(nuevos));
            return nuevos;
        });
    };

    useEffect(() => {
        if (query) {axios.get(`http://127.0.0.1:8000/api/ropa/buscar?q=${query}`)
                .then(res => setResultados(res.data))
                .catch(err => console.error('Error al buscar:', err));
        }
    }, [query]);

    return (
        <div className="content">
            <h2 className="text-xl font-bold mb-4">Resultados Para: "{query.toUpperCase()}"</h2>
            <div className="product-grid">
                {resultados.map((item) => {
                    const imageUrl = item.ruta_imagen?.startsWith('http') ? item.ruta_imagen : `http://127.0.0.1:8000/storage/${item.ruta_imagen}`;
                    return (<ProductoItem key={item.id} id={item.id} img={imageUrl} nombre={item.titulo} precio={item.precio} tipo="ropa" esFavorito={favoritos.includes(item.id)} onToggleFavorito={() => toggleFavorito(item.id)}/>);
                })}
            </div>
        </div>
    );
};

export default Busqueda;