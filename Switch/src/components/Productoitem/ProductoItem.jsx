import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductoItem = ({ id, img, nombre, precio }) => {
    const { moneda } = useContext(ShopContext);

    return (
        <Link
            to={`/producto/${id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <div className="overflow-hidden rounded-t-lg">
                <img
                    src={`http://127.0.0.1:8000/storage/${img}`}
                    alt={nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.target.style.display = 'none')}
                />
            </div>
            <div className="p-4">
                <p className="text-base font-medium text-gray-900 truncate">{nombre}</p>
                <p className="text-sm text-gray-600 mt-1">{moneda}{precio}</p>
            </div>
        </Link>
    );
};

export default ProductoItem;
