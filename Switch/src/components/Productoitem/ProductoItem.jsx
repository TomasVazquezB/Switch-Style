import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductoItem = ({ id, img, nombre, precio }) => {
    const { moneda } = useContext(ShopContext);

    return (
        <Link
            to={`/producto/${id}`}
            onClick={() => window.scrollTo(0, 0)}
            className='text-gray-700 cursor-pointer block'
        >
            <div className='overflow-hidden border border-gray-300 rounded aspect-square bg-white'>
                <img
                    src={`http://127.0.0.1:8000/storage/${img}`}
                    alt={nombre}
                    className='w-full h-full object-contain p-2 transition duration-200 hover:scale-105'
                    onError={(e) => (e.target.style.display = 'none')}
                />
            </div>
            <p className='pt-3 pb-1 text-sm truncate'>{nombre}</p>
            <p className='text-sm font-medium'>{moneda}{precio}</p>
        </Link>
    );
};

export default ProductoItem;
