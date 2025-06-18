// ✅ Productos.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Wallet } from "@mercadopago/sdk-react";

const Productos = () => {
    const { tipo, productoId } = useParams(); // nota: tipo puede ser "ropa" o "accesorio"
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
        const url = `http://127.0.0.1:8000/api/${tipo}/${productoId}`;
        axios.get(url)
            .then(res => {
                setProductoData(res.data);
                if (res.data.imagenes?.length > 0) {
                    setImg(`http://127.0.0.1:8000/storage/${res.data.imagenes[0].ruta}`);
                }
            })
            .catch(() => toast.error("Producto no encontrado"));
    }, [productoId, tipo]);

    useEffect(() => {
        const ordenar = [...reviews];
        if (sortReviews === 'recientes') ordenar.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        if (sortReviews === 'mejor') ordenar.sort((a, b) => b.puntuacion - a.puntuacion);
        if (sortReviews === 'peor') ordenar.sort((a, b) => a.puntuacion - b.puntuacion);
        setReviews(ordenar);
    }, [sortReviews]);

    const handleAgregarAlCarrito = () => {
        if (!talla && tipo === 'ropa') return toast.error('Por favor, seleccione una talla.');
        toast.success('Producto agregado al carrito');
        setTimeout(() => navigate('/carrito'), 1000);
    };

    const generarPreferencia = () => {
        if (!talla && tipo === 'ropa') return toast.error('Por favor, seleccione una talla.');
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
            });
    };

    if (!productoData) return <div className="p-10 text-center text-gray-500">Cargando producto...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Galería de miniaturas */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto w-full lg:w-28">
                    {productoData.imagenes.map((imgItem, index) => (
                        <img
                            key={index}
                            src={`http://127.0.0.1:8000/storage/${imgItem.ruta}`}
                            alt={`Miniatura ${index + 1}`}
                            onClick={() => setImg(`http://127.0.0.1:8000/storage/${imgItem.ruta}`)}
                            className="w-20 h-20 object-cover border rounded cursor-pointer"
                        />
                    ))}
                </div>

                {/* Imagen principal */}
                <div className="flex-1">
                    <img src={img} alt="Producto" className="w-full rounded-lg shadow-md object-contain max-h-[500px]" />
                </div>

                {/* Detalles del producto */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-bold">{productoData.titulo}</h2>
                    <p className="text-gray-700">{productoData.descripcion}</p>
                    <p className="text-xl font-semibold text-green-700">${Number(productoData.precio).toFixed(2)}</p>

                    {/* Tallas solo si es ropa */}
                    {tipo === 'ropa' && productoData.tallas?.length > 0 && (
                        <div>
                            <p className="mb-1 font-medium">Tallas disponibles:</p>
                            <div className="flex gap-3">
                                {productoData.tallas.map((t, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setTalla(t.nombre)}
                                        className={`px-4 py-2 border rounded-full transition ${talla === t.nombre ? 'bg-black text-white' : 'bg-white text-black'}`}
                                    >
                                        {t.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-4 mt-4">
                        <button onClick={handleAgregarAlCarrito} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                            Agregar al carrito
                        </button>
                        <button onClick={generarPreferencia} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Comprar ahora
                        </button>
                    </div>

                    {/* Pagos */}
                    {mostrarPagos && (
                        <div className="mt-6 space-y-6">
                            <PayPalButtons
                                style={{ layout: "horizontal" }}
                                createOrder={(data, actions) =>
                                    actions.order.create({ purchase_units: [{ amount: { value: productoData.precio.toFixed(2) } }] })}
                                onApprove={(data, actions) =>
                                    actions.order.capture().then(details => {
                                        toast.success(`Pago aprobado por ${details.payer.name.given_name}`);
                                        navigate("/carrito");
                                    })}
                            />
                            <Wallet initialization={{ preferenceId }} />
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-10">
                <div className="flex gap-6 border-b mb-4">
                    <button onClick={() => setActiveTab('descripcion')} className={`pb-2 ${activeTab === 'descripcion' ? 'border-b-2 font-bold' : 'text-gray-500'}`}>
                        Descripción
                    </button>
                    <button onClick={() => setActiveTab('reviews')} className={`pb-2 ${activeTab === 'reviews' ? 'border-b-2 font-bold' : 'text-gray-500'}`}>
                        Reviews ({reviews.length})
                    </button>
                </div>

                {activeTab === 'descripcion' ? (
                    <p className="text-sm text-gray-600">{productoData.descripcion}</p>
                ) : (
                    <div className="space-y-4">
                        <select value={sortReviews} onChange={(e) => setSortReviews(e.target.value)} className="border px-3 py-2 rounded-md text-gray-700">
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
