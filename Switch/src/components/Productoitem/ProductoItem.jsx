import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { DataContext } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductoItem.css';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="20" fill="#9ca3af">Sin imagen</text>
    </svg>`
  );

const ProductoItem = ({ id, img, nombre, precio, tipo, eager = false }) => {
  const { moneda } = useContext(ShopContext);
  const { darkMode } = useContext(DataContext);

  const handleAgregarAlCarrito = () => {
    const nuevoItem = {
      producto_id: id,
      titulo: typeof nombre === 'string' ? nombre : 'Producto',
      precio: precio,
      ruta_imagen: img || '',
      talla: null,
      cantidad: 1,
      tipo,
    };

    try {
      const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
      const index = carritoActual.findIndex(
        (item) =>
          item.producto_id === nuevoItem.producto_id &&
          item.talla === nuevoItem.talla &&
          item.tipo === nuevoItem.tipo
      );

      if (index >= 0) {
        carritoActual[index].cantidad += 1;
      } else {
        carritoActual.push(nuevoItem);
      }

      localStorage.setItem('carrito', JSON.stringify(carritoActual));
      toast.success('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('No se pudo agregar al carrito');
    }
  };

  const isStringTitle = typeof nombre === 'string';

  return (
    <Link
      to={`/producto/${tipo}/${id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="block"
    >
      <div className="h-[500px] overflow-hidden">
        <img
          src={img || FALLBACK_IMG}
          alt={isStringTitle ? nombre : 'Producto'}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
        />
      </div>

      <div className="px-4 pb-4 pt-2">
        {isStringTitle ? (
          <p className="text-base font-semibold truncate">{nombre}</p>
        ) : (
          nombre
        )}
        <p className="text-sm mt-1 opacity-90">
          {moneda}
          {precio}
        </p>
      </div>
    </Link>
  );
};

export default ProductoItem;
