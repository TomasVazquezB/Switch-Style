import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext.jsx'
import { assets } from '../../assets/assets.js';
import CarritoTotal from '../../components/CarritoTotal.jsx';

const Carrito = () => {

    const { productos, moneda, navigate, carritoItems, updateCantidad } = useContext(ShopContext);

    const [carritoData, setCarritoData] = useState([]);

    useEffect(() => {
        const tempData = []
        for (const items in carritoItems) {
            for (const item in carritoItems[items]) {
                if (carritoItems[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        talla: item,
                        cantidad: carritoItems[items][item]
                    })
                }
            }
        }
        console.log(tempData);
        setCarritoData(tempData)
    }, [carritoItems])

    return (
        <div className='border-t pt-14'>

            <div>
                {carritoData.map((item, index) => {

                    const productoData = productos.find((producto) => producto._id === item._id);

                    return (

                        <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                            <div className='flex items-start gap-6'>
                                <img className='w-16 sm:w-20' src={productoData.image[0]} alt="" />
                                <div>
                                    <p className='text-xs sm:text-lg font-medium'>{productoData.nombre}</p>
                                    <div className='flex items-center gap-5 mt-2'>
                                        <p>{moneda}{productoData.precio}</p>
                                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.talla}</p>
                                    </div>
                                </div>
                            </div>
                            <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateCantidad(item._id, item.talla, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.cantidad} />
                            <img onClick={() => updateCantidad(item._id, item.talla, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
                        </div>
                    )

                })}
            </div>

            <div className='flex justify-end my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CarritoTotal />
                    <div className='w-full text-end'>
                        <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Carrito
