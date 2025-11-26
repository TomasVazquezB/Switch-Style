import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicApi } from '../../api/axios';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import './carrito.css';

const getCartKey = (usuario) => {
    if (!usuario?.id) return "carrito_guest";
    return `carrito_${usuario.id}`;
};


const Carrito = () => {
    const navigate = useNavigate();

    const { usuario } = useContext(DataContext);

    const [carritoData, setCarritoData] = useState([]);

    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const key = getCartKey(usuario);
        try {
            const saved = localStorage.getItem(key);
            const parsed = saved ? JSON.parse(saved) : [];
            setCarritoData(Array.isArray(parsed) ? parsed : []);
        } catch {
            setCarritoData([]);
        }
    }, [usuario]);


    const [productos, setProductos] = useState([]);
    const [accesorios, setAccesorios] = useState([]);
    const [moneda, setMoneda] = useState("$");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ropaRes, accesoriosRes] = await Promise.all([
                    publicApi.get('/ropa'),
                    publicApi.get('/accesorios')
                ]);
                setProductos(ropaRes.data);
                setAccesorios(accesoriosRes.data);
                setCargando(false);   // ✔ FIN DE CARGA
            } catch (error) {
                console.error("Error al obtener productos o accesorios:", error);
            }
        };
        fetchData();
    }, []);

    const buscarProducto = (item) => {
        const fuente = item.tipo === 'accesorio' ? accesorios : productos;
        return fuente.find(p => p.id === item.producto_id);
    };

    const calcularTotal = () => {
        return carritoData.reduce((total, item) => {
            const producto = buscarProducto(item);
            const precio = parseFloat(producto?.precio || 0);
            return total + (precio * item.cantidad);
        }, 0).toFixed(2);
    };

    const actualizarCantidad = (index, nuevaCantidad) => {
        const item = carritoData[index];
        const producto = buscarProducto(item);
        const tallaData = producto?.tallas?.find(t => t.nombre === item.talla);

        let stockDisponible = producto?.stock || producto?.cantidad || 100;
        if (tallaData) stockDisponible = tallaData.pivot?.cantidad || 100;

        if (nuevaCantidad < 1) return;
        if (nuevaCantidad > stockDisponible) {
            toast.error(`Stock máximo disponible: ${stockDisponible}`);
            return;
        }

        const actualizado = [...carritoData];
        actualizado[index].cantidad = nuevaCantidad;
        setCarritoData(actualizado);
        localStorage.setItem(getCartKey(usuario), JSON.stringify(actualizado));
    };

    const eliminarProducto = (index) => {
        const actualizado = [...carritoData];
        actualizado.splice(index, 1);
        setCarritoData(actualizado);
        localStorage.setItem(getCartKey(usuario), JSON.stringify(actualizado));
    };



    const handleProceedToPayment = () => {
        if (carritoData.length === 0) {
            toast.error("Tu carrito está vacío");
            return;
        }

        if (!usuario) {
            toast.error("Debes iniciar sesión para continuar");
            navigate("/login");
            return;
        }
        for (const item of carritoData) {
            const p = buscarProducto(item);
            if (!p) {
                toast.error("Tu carrito contiene productos inexistentes o sin stock. Revísalo.");
                return;
            }
        }

        navigate("/confpago");
    };

    if (cargando) {
        return <div className="cart-container"><p>Cargando productos...</p></div>;
    }

    return (
        <div className="cart-container">
            <div className="cart-items">
                <h2 className="carrito-vacio">Carrito de Compras</h2>
                <br />
                {carritoData.length === 0 ? (
                    <p className="carrito-vacio2">Tu carrito está vacío</p>
                ) : (
                    carritoData.map((item, index) => {
                        const producto = buscarProducto(item);
                        if (!producto) {
                            // ❌ Si todavía no cargaron productos del backend, NO mostrar error
                            if (cargando) return null;

                            // ✔ Solo mostrar error si realmente no existe
                            toast.error("Hay productos que ya no están disponibles. Actualiza tu carrito.");
                            return null;
                        }


                        const imagen = item.ruta_imagen
                            ? item.ruta_imagen
                            : producto.ruta_imagen?.startsWith('http')
                                ? item.ruta_imagen
                                : toImageUrl(producto.ruta_imagen);
                        const talla = item.talla ? ` | ${item.talla}` : '';

                        return (
                            <div key={index} className="cart-product">
                                <br />
                                <img src={imagen} alt={producto.titulo} />
                                <br />
                                <div className="cart-product-info">
                                    <h4>{producto.titulo}</h4>
                                    <p>{moneda}{parseFloat(producto.precio).toFixed(2)}{talla}</p>
                                    <div className="cart-qty-controls">
                                        <button onClick={() => actualizarCantidad(index, item.cantidad - 1)}>-</button>
                                        <input
                                            type="number"
                                            value={item.cantidad}
                                            min="1"
                                            onChange={(e) => actualizarCantidad(index, parseInt(e.target.value))}
                                        />
                                        <button onClick={() => actualizarCantidad(index, item.cantidad + 1)}>+</button>
                                        <br />
                                    </div>
                                </div>
                                <br />
                                <button onClick={() => eliminarProducto(index)} className="remove-btn">Eliminar</button>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="order-summary">
                <h3>Resumen de la Compra</h3>
                <br />
                <div className="summary-line">
                    <span>Subtotal</span>
                    <span>{moneda}{calcularTotal()}</span>
                </div>
                <div className="total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">{moneda}{calcularTotal()}</span>
                </div>
                <button className="buttom-pago" onClick={handleProceedToPayment}>Proceder al Pago 💰</button>
            </div>
        </div>
    );
};

export default Carrito;