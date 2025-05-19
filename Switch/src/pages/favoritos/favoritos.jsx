import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Favoritos = () => {
    const { productos, favoritos, moneda, toggleFavorito } = useContext(ShopContext);

    const productosFavoritos = productos.filter(p => favoritos.includes(p._id));

    const handleToggleFavorito = (productoId) => {
        toggleFavorito(productoId);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <br></br>
            <h2 className="text-3xl font-bold mb-6">Mis Favoritos</h2>
            <hr></hr>

            {productosFavoritos.length === 0 ? (
                <p className="text-gray-600">No tenés productos favoritos aún.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {productosFavoritos.map(producto => (
                        <div
                            key={producto._id}
                            className="border rounded-lg shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col"
                        >
                            <Link
                                to={`/producto/${producto._id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                                className="block"
                            >
                                <img
                                    src={producto.img[0]}
                                    alt={producto.nombre}
                                    className="w-full object-contain bg-white rounded mb-4"
                                />
                                <h4 className="text-lg font-semibold">{producto.nombre}</h4>
                                <p className="text-sm text-gray-600">{moneda}{producto.precio}</p>
                            </Link>

                            {/* Botón con ícono de corazón para quitar */}
                            <button
                                onClick={() => {
                                    handleToggleFavorito(producto._id);
                                    toast.info("Producto quitado de favoritos 🤍");
                                }}
                                className="mt-4 flex items-center text-red-600 hover:text-red-700 transition text-sm gap-2 self-start"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 
                    5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
                    1.06-1.06a5.5 5.5 0 000-7.78z" />
                                </svg>
                                Quitar de favoritos
                            </button>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favoritos;
