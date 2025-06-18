import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Wallet } from "@mercadopago/sdk-react";
import './Productos.css';

const Productos = () => {
    const { tipo, productoId } = useParams();
    const navigate = useNavigate();

    const [productoData, setProductoData] = useState(null);
    const [talla, setTalla] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [stockDisponible, setStockDisponible] = useState(0);
    const [img, setImg] = useState('');
    const [activeTab, setActiveTab] = useState('descripcion');
    const [preferenceId, setPreferenceId] = useState(null);
    const [mostrarPagos, setMostrarPagos] = useState(false);
    const [sortReviews, setSortReviews] = useState('recientes');
    const [reviews] = useState([
        { id: 1, autor: 'Juan', fecha: '2025-06-01', comentario: 'Muy buen producto.', puntuacion: 5 },
        { id: 2, autor: 'Ana', fecha: '2025-06-05', comentario: 'Podría ser mejor.', puntuacion: 3 }
    ]);

    useEffect(() => {
        const endpoint = tipo.includes('accesorio') ? 'accesorios' : 'ropa';
        const url = `http://127.0.0.1:8000/api/${endpoint}/${productoId}`;
        axios.get(url)
            .then(res => {
                setProductoData(res.data);
                if (res.data.imagenes?.length > 0) {
                    setImg(`http://127.0.0.1:8000/storage/${res.data.imagenes[0].ruta}`);
                }
                if (tipo.includes('accesorio')) {
                    setStockDisponible(res.data.stock || 0);
                }
            })
            .catch(() => toast.error("Producto no encontrado"));
    }, [productoId, tipo]);

    const handleSeleccionTalla = (nombreTalla) => {
        setTalla(nombreTalla);
        const tallaData = productoData.tallas.find(t => t.nombre === nombreTalla);
        setStockDisponible(tallaData?.pivot?.cantidad || 0);
        setCantidad(1);
    };

    const handleAgregarAlCarrito = () => {
        if (!talla && tipo.includes('ropa')) return toast.error('Seleccione una talla.');
        if (cantidad < 1 || cantidad > stockDisponible) return toast.error('Cantidad inválida.');

        const nuevoItem = {
            producto_id: productoData.id,
            titulo: productoData.titulo,
            precio: productoData.precio,
            ruta_imagen: productoData.imagenes?.[0]?.ruta
                ? `http://127.0.0.1:8000/storage/${productoData.imagenes[0].ruta}`
                : '',
            talla: tipo.includes('ropa') ? talla : null,
            cantidad
        };

        const carritoExistente = JSON.parse(localStorage.getItem("carrito")) || [];
        const index = carritoExistente.findIndex(
            (item) => item.producto_id === nuevoItem.producto_id && item.talla === nuevoItem.talla
        );

        if (index >= 0) {
            carritoExistente[index].cantidad += cantidad;
        } else {
            carritoExistente.push(nuevoItem);
        }

        localStorage.setItem("carrito", JSON.stringify(carritoExistente));
        toast.success("Producto agregado al carrito");
        setTimeout(() => navigate('/carrito'), 1000);
    };

    const generarPreferencia = () => {
        if (!talla && tipo.includes('ropa')) return toast.error('Seleccione una talla.');
        const producto = {
            title: productoData.titulo,
            quantity: cantidad,
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

    if (!productoData) return <div className="content">Cargando producto...</div>;

    const sinStock = stockDisponible === 0;

    return (
        <div className="content">
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '120px auto 1.2fr',
                columnGap: '1rem',
                alignItems: 'start'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {productoData.imagenes.map((imgItem, index) => {
                        const ruta = `http://127.0.0.1:8000/storage/${imgItem.ruta}`;
                        return (
                            <img
                                key={index}
                                src={ruta}
                                alt={`Miniatura ${index + 1}`}
                                onClick={() => setImg(ruta)}
                                className={`thumbnail ${img === ruta ? 'active' : ''}`}
                            />
                        );
                    })}
                </div>

                <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '0.75rem' }}>
                    <img src={img} alt="Producto" className="main-image" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{productoData.titulo}</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginTop: '1rem' }}>
                            ${Number(productoData.precio).toFixed(2)}
                        </p>
                        {tipo.includes('accesorio') && (
                            <p style={{ fontSize: '1rem', marginTop: '0.5rem', color: sinStock ? 'red' : '#555' }}>
                                {sinStock ? 'Sin stock disponible' : `Stock disponible: ${stockDisponible}`}
                            </p>
                        )}
                    </div>

                    {tipo.includes('ropa') && productoData.tallas?.length > 0 && (
                        <div>
                            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Tallas disponibles:</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {productoData.tallas.map((t, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSeleccionTalla(t.nombre)}
                                        className={`talla-btn ${talla === t.nombre ? 'active' : ''}`}
                                    >
                                        {t.nombre}
                                    </button>
                                ))}
                            </div>

                            {talla && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad (Stock disponible: {stockDisponible})
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={stockDisponible}
                                        value={cantidad}
                                        onChange={(e) => setCantidad(parseInt(e.target.value))}
                                        className="border px-3 py-1 w-24 rounded"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {tipo.includes('accesorio') && !sinStock && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={stockDisponible}
                                value={cantidad}
                                onChange={(e) => setCantidad(parseInt(e.target.value))}
                                className="border px-3 py-1 w-24 rounded"
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <button
                            className="button carrito"
                            onClick={handleAgregarAlCarrito}
                            disabled={sinStock}
                            style={sinStock ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
                        >
                            Agregar al carrito
                        </button>
                        <button
                            className="button comprar"
                            onClick={generarPreferencia}
                            disabled={sinStock}
                            style={sinStock ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
                        >
                            Comprar ahora
                        </button>
                    </div>

                    {mostrarPagos && (
                        <div style={{ marginTop: '2rem' }}>
                            <PayPalButtons
                                style={{ layout: "horizontal" }}
                                createOrder={(data, actions) =>
                                    actions.order.create({ purchase_units: [{ amount: { value: productoData.precio.toFixed(2) } }] })
                                }
                                onApprove={(data, actions) =>
                                    actions.order.capture().then(details => {
                                        toast.success(`Pago aprobado por ${details.payer.name.given_name}`);
                                        navigate("/carrito");
                                    })
                                }
                            />
                            <div style={{ marginTop: '1rem' }}>
                                <Wallet initialization={{ preferenceId }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs y reviews */}
            <div style={{
                marginTop: '4rem',
                maxWidth: '1000px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    borderBottom: '1px solid #ddd',
                    marginBottom: '1rem'
                }}>
                    <button
                        onClick={() => setActiveTab('descripcion')}
                        className={`tab-button ${activeTab === 'descripcion' ? 'active' : ''}`}
                    >
                        Descripción
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    >
                        Reviews ({reviews.length})
                    </button>
                </div>

                {activeTab === 'descripcion' ? (
                    <p style={{ color: '#444', fontSize: '0.95rem' }}>{productoData.descripcion}</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <select
                            value={sortReviews}
                            onChange={(e) => setSortReviews(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                fontSize: '0.875rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #ccc',
                                width: 'fit-content'
                            }}
                        >
                            <option value="recientes">Más recientes</option>
                            <option value="mejor">Mejor puntuados</option>
                            <option value="peor">Peor puntuados</option>
                        </select>

                        {reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.875rem'
                                }}>
                                    <span className="review-author">{review.autor}</span>
                                    <span className="review-date">{review.fecha}</span>
                                </div>
                                <p className="review-text">{review.comentario}</p>
                                <p className="review-stars">⭐ {review.puntuacion}/5</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Productos;
