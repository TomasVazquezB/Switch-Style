import React, { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductoItem = ({ id, img, nombre, precio }) => {
const { moneda } = useContext(ShopContext);

    return (
        <Link to={`/producto/${id}`} onClick={() => window.scrollTo(0, 0)} className='text-gray-700 cursor-pointer'>
            <div className=' overflow-hidden'>
                <img className='hover:scale-110 transition ease-in-out' src={img[0]} alt=""/>
            </div>
            <p className='pt-3 pb-1 text-sm'>{nombre}</p>
            <p className='text-sm font-medium'>{moneda}{precio}</p>
        </Link>
    )
}

export default ProductoItem