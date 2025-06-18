import React, { useEffect, useState } from 'react';
import CarritoTotal from '../../components/CarritoTotal/CarritoTotal.jsx';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Wallet } from "@mercadopago/sdk-react";
import { toast } from 'react-toastify';

const Carrito = () => {
    const [carritoData, setCarritoData] = useState(() => {
        const saved = localStorage.getItem('carrito');
        return saved ? JSON.parse(saved) : [];
    });
    const [productos, setProductos] = useState([]);
    const [accesorios, setAccesorios] = useState([]);
    const [moneda, setMoneda] = useState("$");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ropaRes, accesoriosRes] = await Promise.all([
                    fetch("http://localhost:8000/api/ropa"),
                    fetch("http://localhost:8000/api/accesorios")
                ]);
                const ropaData = await ropaRes.json();
                const accesoriosData = await accesoriosRes.json();
                setProductos(ropaData);
                setAccesorios(accesoriosData);
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
            return total + (producto ? producto.precio * item.cantidad : 0);
        }, 0).toFixed(2);
    };

    const calcularCantidadTotal = () => {
        return carritoData.reduce((acc, item) => acc + item.cantidad, 0);
    };

    const limpiarCarrito = () => {
        localStorage.removeItem('carrito');
        setCarritoData([]);
    };

    const actualizarCantidad = (index, nuevaCantidad) => {
        const item = carritoData[index];
        const producto = buscarProducto(item);
        const tallaData = producto?.tallas?.find(t => t.nombre === item.talla);

        let stockDisponible = 1;
        if (item.talla && tallaData) {
            stockDisponible = tallaData.pivot?.cantidad || 1;
        } else if (producto?.stock !== undefined) {
            stockDisponible = producto.stock;
        } else if (producto?.cantidad !== undefined) {
            stockDisponible = producto.cantidad;
        }

        if (nuevaCantidad < 1) return;
        if (nuevaCantidad > stockDisponible) {
            toast.error(`Stock máximo disponible: ${stockDisponible}`);
            return;
        }

        const actualizado = [...carritoData];
        actualizado[index].cantidad = nuevaCantidad;
        setCarritoData(actualizado);
        localStorage.setItem('carrito', JSON.stringify(actualizado));
    };

    const eliminarProducto = (index) => {
        const actualizado = [...carritoData];
        actualizado.splice(index, 1);
        setCarritoData(actualizado);
        localStorage.setItem('carrito', JSON.stringify(actualizado));
    };

    return (
        <div className="main">
            <div className="content px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-8 pb-3">Tu carrito</h2>

                    <div className="border-t pt-14">
                        {carritoData.length === 0 ? (
                            <p className="text-gray-600 pt-5">Tu carrito está vacío.</p>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    {carritoData.map((item, index) => {
                                        const productoData = buscarProducto(item);
                                        if (!productoData) return null;

                                        const imagen = item.ruta_imagen || productoData.ruta_imagen || '';

                                        const tallaData = productoData?.tallas?.find(t => t.nombre === item.talla);
                                        let stockDisponible = 1;
                                        if (item.talla && tallaData) {
                                            stockDisponible = tallaData.pivot?.cantidad || 1;
                                        } else if (productoData?.stock !== undefined) {
                                            stockDisponible = productoData.stock;
                                        } else if (productoData?.cantidad !== undefined) {
                                            stockDisponible = productoData.cantidad;
                                        }

                                        return (
                                            <div key={index} className="py-4 border-b text-gray-700 grid grid-cols-[4fr_auto_auto_auto] items-center gap-4">
                                                <div className="flex items-start gap-6">
                                                    <img className="w-16 sm:w-20 object-cover" src={imagen} alt={productoData.titulo} />
                                                    <div>
                                                        <p className="text-xs sm:text-lg font-medium">{productoData.titulo}</p>
                                                        <div className="flex items-center gap-5 mt-2">
                                                            <p>{moneda}{productoData.precio}</p>
                                                            {item.talla && <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.talla}</p>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        –
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={stockDisponible}
                                                        value={item.cantidad}
                                                        onChange={(e) => actualizarCantidad(index, parseInt(e.target.value))}
                                                        className="w-16 px-2 py-1 border rounded text-center"
                                                    />
                                                    <button
                                                        onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                                                        className={`px-2 py-1 rounded ${item.cantidad >= stockDisponible ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                        disabled={item.cantidad >= stockDisponible}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <p>x{item.cantidad}</p>

                                                <button
                                                    onClick={() => eliminarProducto(index)}
                                                    className="text-red-500 font-bold text-lg"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="text-end mt-8">
                                    <p className="text-sm text-gray-500 mb-2">Total de ítems: {calcularCantidadTotal()}</p>
                                    <button
                                        onClick={limpiarCarrito}
                                        className="border px-4 py-2 rounded-full text-sm bg-red-600 text-black hover:bg-red-700"
                                    >
                                        Vaciar carrito
                                    </button>
                                </div>

                                <div className="flex justify-end my-20">
                                    <div className="w-full sm:w-[450px]">
                                        <br />
                                        <CarritoTotal total={calcularTotal()} moneda={moneda} />

                                        <div className="w-full text-end mt-10">
                                            <h3 className="font-semibold mb-3">Elige método de pago:</h3>

                                            <div className="mb-6">
                                                <PayPalButtons
                                                    style={{ layout: "horizontal" }}
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [{
                                                                amount: { value: calcularTotal() }
                                                            }]
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order.capture().then((details) => {
                                                            alert(`Transacción completada por ${details.payer.name.given_name}`);
                                                            limpiarCarrito();
                                                        });
                                                    }}
                                                />
                                                <div className="mt-4">
                                                    <Wallet initialization={{ preferenceId: null }} customization={{ texts: { valueProp: 'smart_option' } }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrito;