import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext.jsx';
import { assets } from '../../assets/assets.js';
import CarritoTotal from '../../components/CarritoTotal/CarritoTotal.jsx';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Wallet } from "@mercadopago/sdk-react";

const Carrito = () => {
    const {
        productos,
        moneda,
        carritoItems,
        updateCantidad,
        limpiarCarrito
    } = useContext(ShopContext);

    const [carritoData, setCarritoData] = useState([]);
    const [preferenceId, setPreferenceId] = useState(null);
    const [initPoint, setInitPoint] = useState(null); // Nuevo

    useEffect(() => {
        const tempData = [];
        for (const items in carritoItems) {
            for (const item in carritoItems[items]) {
                if (carritoItems[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        talla: item,
                        cantidad: carritoItems[items][item]
                    });
                }
            }
        }
        setCarritoData(tempData);
    }, [carritoItems]);

    useEffect(() => {
        if (carritoData.length === 0) return;

        const items = carritoData.map(item => {
            const producto = productos.find(p => p._id === item._id);
            return {
                title: producto.nombre,
                quantity: item.cantidad,
                currency_id: "ARS",
                unit_price: producto.precio
            };
        });

        fetch("http://localhost:4000/create_preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items })
        })
            .then(res => res.json())
            .then(data => {
                setPreferenceId(data.preferenceId);
                setInitPoint(data.init_point);
            })
            .catch(err => console.error(err));
    }, [carritoData]);

    const calcularTotal = () => {
        return carritoData.reduce((total, item) => {
            const producto = productos.find(p => p._id === item._id);
            return total + (producto.precio * item.cantidad);
        }, 0).toFixed(2);
    };

    return (
        <div className='main'>
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
                                        const productoData = productos.find(p => p._id === item._id);
                                        if (!productoData) return null;

                                        return (
                                            <div
                                                key={index}
                                                className="py-4 border-b text-gray-700 grid 
                        grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] 
                        items-center gap-4"
                                            >
                                                <div className="flex items-start gap-6">
                                                    <img
                                                        className="w-16 sm:w-20 object-cover"
                                                        src={productoData.img[0]}
                                                        alt={productoData.nombre}
                                                    />
                                                    <div>
                                                        <p className="text-xs sm:text-lg font-medium">{productoData.nombre}</p>
                                                        <div className="flex items-center gap-5 mt-2">
                                                            <p>{moneda}{productoData.precio}</p>
                                                            <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.talla}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <input
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        if (val > 0) updateCantidad(item._id, item.talla, val);
                                                    }}
                                                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                                                    type="number"
                                                    min={1}
                                                    defaultValue={item.cantidad}
                                                />

                                                <img
                                                    onClick={() => updateCantidad(item._id, item.talla, 0)}
                                                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                                                    src={assets.bin_icon}
                                                    alt="Eliminar"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="text-end mt-6">
                                    <button
                                        onClick={limpiarCarrito}
                                        className="border px-4 py-2 rounded-full text-sm bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Vaciar carrito
                                    </button>
                                </div>

                                <div className="flex justify-end my-20">
                                    <div className="w-full sm:w-[450px]">
                                        <CarritoTotal />

                                        <div className="w-full text-end mt-10">
                                            <h3 className="font-semibold mb-4">Elige método de pago:</h3>

                                            {/* PayPal */}
                                            <div className="mb-6">
                                                <PayPalButtons
                                                    style={{ layout: "horizontal" }}
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [{
                                                                amount: {
                                                                    value: calcularTotal()
                                                                }
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
                                            </div>

                                            {/* MercadoPago Wallet */}
                                            {preferenceId && (
                                                <div className="mb-6">
                                                    <Wallet
                                                        initialization={{ preferenceId }}
                                                        customization={{ texts: { valueProp: 'smart_option' } }}
                                                    />
                                                </div>
                                            )}

                                            {/* Botón personalizado de MercadoPago */}
                                            {initPoint && (
                                                <button
                                                    onClick={() => window.location.href = initPoint}
                                                    className="mt-4 px-5 py-2 flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition-transform transform hover:scale-105"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2l1-2h13l1 2h2M7 16h10M9 20h6" />
                                                    </svg>
                                                    Pagar con MercadoPago
                                                </button>
                                            )}
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
