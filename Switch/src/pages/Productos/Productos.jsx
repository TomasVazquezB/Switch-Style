import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Wallet } from "@mercadopago/sdk-react";
import { assets } from '../../assets/assets';
import './Productos.css';

const Productos = () => {
    const { productoId } = useParams();
    const navigate = useNavigate();

    const [productoData, setProductoData] = useState(null);
    const [talla, setTalla] = useState('');
    const [img, setImg] = useState('');
    const [activeTab, setActiveTab] = useState('descripcion');
    const [preferenceId, setPreferenceId] = useState(null);
    const [mostrarPagos, setMostrarPagos] = useState(false);

    const [reviews, setReviews] = useState([
        { id: 1, autor: 'Juan P.', comentario: 'Excelente producto!', puntuacion: 5, fecha: '2024-04-10' },
        { id: 2, autor: 'Maria G.', comentario: 'Muy bueno pero la entrega tardó.', puntuacion: 4, fecha: '2024-04-15' },
        { id: 3, autor: 'Lucas R.', comentario: 'No me convenció el material.', puntuacion: 2, fecha: '2024-04-05' },
    ]);
    const [sortReviews, setSortReviews] = useState('recientes');

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/ropa/${productoId}`)
            .then(res => {
                setProductoData(res.data);
                if (res.data.imagenes && res.data.imagenes.length > 0) {
                    setImg(`http://127.0.0.1:8000/storage/${res.data.imagenes[0].ruta}`);
                }
            })
            .catch(err => {
                toast.error("Producto no encontrado");
                console.error(err);
            });
    }, [productoId]);

    useEffect(() => {
        const ordenar = [...reviews];
        if (sortReviews === 'recientes') {
            ordenar.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        } else if (sortReviews === 'mejor') {
            ordenar.sort((a, b) => b.puntuacion - a.puntuacion);
        } else if (sortReviews === 'peor') {
            ordenar.sort((a, b) => a.puntuacion - b.puntuacion);
        }
        setReviews(ordenar);
    }, [sortReviews]);

    const handleAgregarAlCarrito = () => {
        if (!talla) {
            toast.error('Por favor, seleccione una talla.');
            return;
        }
        toast.success('Producto agregado al carrito');
        setTimeout(() => navigate('/carrito'), 1000);
    };

    const generarPreferencia = () => {
        if (!talla) {
            toast.error('Por favor, seleccione una talla.');
            return;
        }

        const producto = {
            title: productoData.titulo,
            quantity: 1,
            currency_id: "ARS",
            unit_price: productoData.precio
        };

        fetch("http://localhost:4000/create_preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [producto] })
        })
            .then(res => res.json())
            .then(data => {
                setPreferenceId(data.preferenceId);
                setMostrarPagos(true);
            })
            .catch(err => console.error(err));
    };

    if (!productoData) return <div className="p-10 text-center text-gray-500">Cargando producto...</div>;

    return (
        <div className="content p-6">
            <div className="flex flex-col sm:flex-row gap-10">
                {/* Galería de imágenes */}
                <div className="flex-1">
                    <div className="flex gap-4 mb-4 overflow-x-auto sm:flex-col sm:overflow-y-auto sm:w-28">
                        {productoData.imagenes.map((imagen, index) => (
                            <img
                                key={index}
                                src={`http://127.0.0.1:8000/storage/${imagen.ruta}`}
                                alt={`Imagen ${index + 1}`}
                                className="w-20 h-20 object-cover border cursor-pointer"
                                onClick={() => setImg(`http://127.0.0.1:8000/storage/${imagen.ruta}`)}
                            />
                        ))}
                    </div>
                    <img src={img} alt="Producto" className="w-full h-auto rounded shadow" />
                </div>

                {/* Detalles */}
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{productoData.titulo}</h2>
                    <p className="text-gray-700 mb-2">{productoData.descripcion}</p>
                    <p className="text-xl font-semibold text-green-700 mb-4">${productoData.precio.toFixed(2)}</p>

                    {/* Tallas */}
                    <div className="mb-4">
                        <p className="font-medium mb-2">Tallas disponibles:</p>
                        <div className="flex gap-3">
                            {productoData.tallas.map((t, index) => (
                                <button
                                    key={index}
                                    onClick={() => setTalla(t.nombre)}
                                    className={`px-4 py-2 border rounded-full ${talla === t.nombre ? 'bg-black text-white' : 'bg-white text-black'
                                        }`}
                                >
                                    {t.nombre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleAgregarAlCarrito} className="btn btn-primary mt-4">
                        Agregar al carrito
                    </button>
                    <button onClick={generarPreferencia} className="btn btn-success ml-4 mt-4">
                        Comprar ahora
                    </button>

                    {/* PayPal y MercadoPago */}
                    {mostrarPagos && (
                        <div className="mt-6 space-y-6">
                            <PayPalButtons
                                style={{ layout: "horizontal" }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{ amount: { value: productoData.precio.toFixed(2) } }]
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then(details => {
                                        toast.success(`Pago aprobado por ${details.payer.name.given_name}`);
                                        navigate("/carrito");
                                    });
                                }}
                            />
                            <Wallet
                                initialization={{ preferenceId }}
                                customization={{ texts: { valueProp: 'smart_option' } }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-10">
                <div className="flex gap-6 border-b mb-4">
                    <button onClick={() => setActiveTab('descripcion')} className={`py-2 ${activeTab === 'descripcion' ? 'border-b-2 font-bold' : 'text-gray-500'}`}>
                        Descripción
                    </button>
                    <button onClick={() => setActiveTab('reviews')} className={`py-2 ${activeTab === 'reviews' ? 'border-b-2 font-bold' : 'text-gray-500'}`}>
                        Reviews ({reviews.length})
                    </button>
                </div>

                {activeTab === 'descripcion' ? (
                    <p className="text-sm text-gray-600">{productoData.descripcion}</p>
                ) : (
                    <div className="space-y-4">
                        <select
                            value={sortReviews}
                            onChange={(e) => setSortReviews(e.target.value)}
                            className="border px-3 py-2 rounded-md text-gray-700"
                        >
                            <option value="recientes">Más recientes</option>
                            <option value="mejor">Mejor puntuados</option>
                            <option value="peor">Peor puntuados</option>
                        </select>
                        {reviews.map(review => (
                            <div key={review.id} className="border p-4 rounded-md bg-gray-50">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">{review.autor}</span>
                                    <span className="text-gray-500">{review.fecha}</span>
                                </div>
                                <p className="mt-2 text-gray-700">{review.comentario}</p>
                                <p className="text-yellow-600 mt-1">⭐ {review.puntuacion}/5</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Productos;
