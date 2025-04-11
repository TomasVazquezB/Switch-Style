import React, { useState } from 'react';
import './carrito.css';

const CarritoPage = () => {
  const [productosCarrito, setProductosCarrito] = useState([]);

  const agregarProducto = (producto) => {
    const existente = productosCarrito.find(item => item.id === producto.id);
    if (existente) {
      const newProductos = productosCarrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      setProductosCarrito(newProductos);
    } else {
      setProductosCarrito([...productosCarrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarProducto = (idProducto) => {
    const newProductos = productosCarrito.filter(item => item.id !== idProducto);
    setProductosCarrito(newProductos);
  };

  const actualizarCantidad = (idProducto, cantidad) => {
    const newProductos = productosCarrito.map(item => item.id === idProducto ? { ...item, cantidad: cantidad } : item);
    setProductosCarrito(newProductos);
  };

  const vaciarCarrito = () => {
    setProductosCarrito([]);
  };

  const calcularTotal = () => {
    return productosCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0).toFixed(2);
  };

  return (
    <div className="carrito-container">
      <h1>Carrito de Compras</h1>
      {productosCarrito.length === 0 ? (
        <p className="no-hay-nada">No hay productos en el carrito</p>
      ) : (
        <>
          <div className="tabla-carrito">
            <table>
              <thead>
                <tr className="txt-heading">
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosCarrito.map((producto, index) => (
                  <tr key={index}>
                    <td><img src={producto.imagen} alt={producto.nombre} className="cart-item-image"/></td>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>
                      <input
                        className="cantidad-producto"
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) => actualizarCantidad(producto.id, parseInt(e.target.value))}
                        min="1"
                      />
                    </td>
                    <td>${(producto.precio * producto.cantidad).toFixed(2)}</td>
                    <td><button className="botonAgregarAccion" onClick={() => eliminarProducto(producto.id)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="product-title">
            <h2>Total:</h2>
          </div>
          <div className="product-price">
            <p>${calcularTotal()}</p>
          </div>
          <div className="cart-action">
            <button className="botonAgregarAccion" onClick={vaciarCarrito}>Vaciar carrito</button>
            <button className="botonAgregarAccion">Ir al Pago</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarritoPage;