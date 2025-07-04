import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductoItem = ({ id, img, nombre, precio, tipo }) => {
    const { moneda } = useContext(ShopContext);

    const handleAgregarAlCarrito = () => {
        const nuevoItem = {
            producto_id: id,
            titulo: nombre,
            precio: precio,
            ruta_imagen: img ? `http://127.0.0.1:8000/storage/${img}` : '',
            talla: null,
            cantidad: 1,
            tipo
        };

        try {
            const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
            const index = carritoActual.findIndex(
                item => item.producto_id === nuevoItem.producto_id && item.talla === nuevoItem.talla && item.tipo === nuevoItem.tipo
            );

            if (index >= 0) {
                carritoActual[index].cantidad += 1;
            } else {
                carritoActual.push(nuevoItem);
            }

            localStorage.setItem("carrito", JSON.stringify(carritoActual));
            toast.success("Producto agregado al carrito");
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            toast.error("No se pudo agregar al carrito");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link
                to={`/producto/${tipo}/${id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="block"
            >
                <div className="overflow-hidden rounded-t-lg h-[600px]">
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

            <div className="p-4 pt-0">
                <button
                    onClick={handleAgregarAlCarrito}
                    className="w-full mt-2 bg-black text-white text-sm py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
};

export default ProductoItem;
