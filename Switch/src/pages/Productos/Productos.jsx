import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';

const Productos = () => {
    const { productoId } = useParams();
    const { productos, moneda, agregarAlCarrito } = useContext(ShopContext);
    const [productoData, setProductoData] = useState(false);
    const [talla, setTalla] = useState("");
    const [img, setImg] = useState("");
    const [activeTab, setActiveTab] = useState('descripcion');

    const [reviews, setReviews] = useState([
        { id: 1, autor: "Juan P.", comentario: "Excelente producto!", puntuacion: 5, fecha: "2024-04-10" },
        { id: 2, autor: "Maria G.", comentario: "Muy bueno pero la entrega tardó.", puntuacion: 4, fecha: "2024-04-15" },
        { id: 3, autor: "Lucas R.", comentario: "No me convenció el material.", puntuacion: 2, fecha: "2024-04-05" },
    ]);
    const [sortReviews, setSortReviews] = useState('recientes'); 

    useEffect(() => {const found = productos.find((item) => item._id === productoId);
        if (found) {setProductoData(found);setImg(found.img[0]);}}, [productoId, productos]);

    const sortReviewsFunction = (tipo) => {
        let reviewsOrdenadas = [...reviews];
        if (tipo === "recientes") {reviewsOrdenadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        } else if (tipo === "mejor") {reviewsOrdenadas.sort((a, b) => b.puntuacion - a.puntuacion);
        } else if (tipo === "peor") {reviewsOrdenadas.sort((a, b) => a.puntuacion - b.puntuacion);
        }
        setReviews(reviewsOrdenadas);
    };

    useEffect(() => {sortReviewsFunction(sortReviews);}, [sortReviews]);

    return productoData ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>  

                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                        {productoData.img.map((item, index) => (<img key={index} onClick={() => setImg(item)} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' src={item} alt="" />))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img className='w-full h-auto' src={img} alt="" />
                    </div>
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{productoData.nombre}</h1>
                    <div className="flex items-center gap-1 mt-3">
                        {[...Array(4)].map((_, i) => (
                            <img key={i} className="w-4" src={assets.star_icon} alt="star" />
                        ))}
                        <img className="w-4" src={assets.star_dull_icon} alt="star-dull" />
                        <span className="text-gray-500 ml-2">(122 reviews)</span>
                    </div>

                    <p className="text-3xl font-semibold text-gray-900 mt-5">{moneda}{productoData.precio}</p>

                    <p className="text-gray-600 mt-5 leading-relaxed">{productoData.descripcion}</p>

                    <div className="mt-8">
                        <h3 className="font-semibold mb-2">Seleccione talla:</h3>
                        <div className="flex gap-3">
                            {productoData.talla.map((size, index) => (
                                <button
                                    key={index}
                                    onClick={() => setTalla(size)}
                                    className={`border px-4 py-2 rounded-full ${talla === size
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 text-black hover:bg-gray-100"
                                        }`}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => agregarAlCarrito(productoData._id, talla)} className="mt-8 bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full transition">AGREGAR AL CARRITO
                    </button>
                </div>
            </div>

            <div className="mt-20">
                <div className="flex border-b">
                    <button onClick={() => setActiveTab('descripcion')} className={`px-6 py-3 text-sm font-semibold transition ${activeTab === 'descripcion' ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"}`}>Descripción</button>
                    <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 text-sm font-semibold transition ${activeTab === 'reviews' ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"}`}>Reviews({reviews.length})</button>
                </div>

                <div className="py-6 text-gray-700 leading-relaxed text-sm">
                    {activeTab === 'descripcion' ? (
                        <p>Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500...</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="mb-4">
                                <select
                                    value={sortReviews}
                                    onChange={(e) => setSortReviews(e.target.value)}
                                    className="border px-3 py-2 rounded-md text-gray-700">
                                    <option value="recientes">Más recientes</option>
                                    <option value="mejor">Mejor puntuados</option>
                                    <option value="peor">Peor puntuados</option>
                                </select>
                            </div>

                            {reviews.map((review) => (
                                <div key={review.id} className="border p-4 rounded-md">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{review.autor}</p>
                                        <p className="text-xs text-gray-400">{review.fecha}</p>
                                    </div>
                                    <p className="mt-2">{review.comentario}</p>
                                    <p className="text-yellow-500 mt-1">Puntuación: {review.puntuacion}/5</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div className="opacity-0">Cargando...</div>
    )
}

export default Productos;