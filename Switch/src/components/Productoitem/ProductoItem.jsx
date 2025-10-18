import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { DataContext } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductoItem.css';

const ProductoItem = ({ id, img, nombre, precio, tipo }) => {
  const { moneda } = useContext(ShopContext);
  const { darkMode } = useContext(DataContext);

  const handleAgregarAlCarrito = () => {
    const nuevoItem = { 
      producto_id: id, 
      titulo: nombre, 
      precio: precio, 
      ruta_imagen: img || '', 
      talla: null, 
      cantidad: 1, 
      tipo 
    };

    try {
      const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
      const index = carritoActual.findIndex(
        item => item.producto_id === nuevoItem.producto_id &&
        item.talla === nuevoItem.talla &&
        item.tipo === nuevoItem.tipo
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
    <div
      className={`product-card rounded-2xl shadow-md transition-all duration-300 overflow-hidden 
        ${darkMode 
          ? 'bg-[#1e1e1e] text-gray-100 hover:shadow-gray-800/40' 
          : 'bg-white text-gray-900 hover:shadow-gray-300/40'
        }`}
    >
      <Link 
        to={`/producto/${tipo}/${id}`} 
        onClick={() => window.scrollTo(0, 0)} 
        className="block"
      >
        <div className="h-[500px] overflow-hidden">
          <img 
            src={img} 
            alt={nombre} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            onError={(e) => (e.target.style.display = 'none')} 
          />
        </div>

        <div className="p-4">
          <p className="text-base font-semibold truncate">{nombre}</p>
          <p className="text-sm mt-1 opacity-90">{moneda}{precio}</p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={handleAgregarAlCarrito}
          className={`w-full mt-2 text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-300
            ${darkMode 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
            }`}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductoItem;
