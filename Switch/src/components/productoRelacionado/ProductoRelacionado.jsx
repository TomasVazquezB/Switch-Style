import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext.jsx';
import ProductoItem from '../Productoitem/ProductoItem';

const ProductoRelacionado = ({ categoria, subCategoria }) => {
    const [relacionado, setRelacionado] = useState([])
    const { productos } = useContext(ShopContext)

    useEffect(() => {

        if (productos.length > 0) {
            let productosCopy = productos.slice()
            productosCopy = productosCopy.filter(item => categoria === item.categoria);
            productosCopy = productosCopy.filter(item => subCategoria === item.subCategoria);
            setRelacionado(productosCopy.slice(0, 5));
        }
    }, [productos])

    return (
        <div className='my-24'>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    related.map((item, index) => (
                        <ProductoItem key={index} id={item._id} img={item.img} nombre={item.nombre} precio={item.precio} />
                    ))
                }
            </div>
        </div>
    )
}

export default ProductoRelacionado