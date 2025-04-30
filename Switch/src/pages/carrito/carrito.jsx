import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext.jsx'
import { assets } from '../../assets/assets.js';
import CarritoTotal from '../../components/CarritoTotal/CarritoTotal.jsx';


const Carrito = () => {
    const { productos, moneda, navigate, carritoItems, updateCantidad } = useContext(ShopContext);
    const [carritoData, setCarritoData] = useState([]);

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



    return (
        <div className='main'>
            <div className="content px-4 py-8">
                <div className="max-w-3xl mx-auto"> {/* Contenedor centrado y más angosto */}

                    <h2 className="text-2xl font-semibold mb-8 pb-3">Tu carrito</h2>

                    <div className="border-t pt-14">
                        {carritoData.length === 0 ? (
                            <p className="text-gray-600 pt-5">Tu carrito está vacío.</p>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    {carritoData.map((item, index) => {
                                        const productoData = productos.find((producto) => producto._id === item._id);
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

                                <br></br>

                                {/* Total + Botón */}
                                <div className="flex justify-end my-20">
                                    <div className="w-full sm:w-[450px]">
                                        <CarritoTotal />
                                        <div className="w-full text-end">

                                            <br></br>

                                            <button
                                                onClick={() => navigate('/place-order')}
                                                className="border px-4 py-2 rounded-full mt-8 bg-black text-white text-sm my-8 px-8 py-3"
                                            >
                                                PROCEED TO CHECKOUT
                                            </button>
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
