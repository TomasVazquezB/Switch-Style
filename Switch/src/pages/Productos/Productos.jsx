import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';

const Productos = () => {

    const { productoId } = useParams();
    const { productos, moneda, addToCarrito } = useContext(ShopContext);
    const [productoData, setProductoData] = useState(false);
    const [talla, setTalla] = useState("")
    const [img, setImg] = useState("")

    const fetchProductoData = async () => {
        productos.map((item) => {
            if (item._id === productoId) {
                setProductoData(item);
                setImg(item.img[0])
                return null;
            }
        })
    }

    useEffect(() => {fetchProductoData()}, [productoId])

    return productoData ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'> 
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                        {productoData.img.map((item, index) => (<img key={index} onClick={() => setImg(item)} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' src={item} alt="" />))}
                    </div>
                    <div className=' sm:w-[80%]'>
                        <img className=' h-auto' src={img} alt="" />
                    </div>
                </div>

                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{productoData.nombre}</h1>
                    <div className='flex items-center gap-1 mt-2'>
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_dull_icon} alt="" />
                        <p className='pl-2'>(122)</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>{moneda}{productoData.precio}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{productoData.descripcion}</p>
                    <div className='flex flex-col gap-4 my-8'>
                        <p>SELECCIONE TALLA:</p>
                        <div className='flex gap-2'>
                            {productoData.talla.map((item, index) => (<button key={index} onClick={() => setTalla(item)} className={`border py-2 px-4 bg-gray-100 ${item === talla ? "border-orange-500" : ""}`}>{item}</button>))}
                        </div>
                    </div>
                    <button onClick={() => addToCarrito(productoData._id, talla)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>AGREGAR AL CARRITO</button>

                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                </div>
            </div>

            <div className='mt-20'>
                <div className='flex'>
                    <b className='border px-5 py-3 text-sm'>Descripción</b>
                    <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
            </div>
        </div>

    ) : <div className=' opacity-0'></div>
}

export default Productos