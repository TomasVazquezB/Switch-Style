import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CarritoTotal.css';

const CarritoTotal = () => {
    const [carritoItems, setCarritoItems] = useState([]);
    const [moneda, setMoneda] = useState('$');
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchCarrito = async () => {
            try {
                const carritoResponse = await axios.get('http://localhost:8000/api/carrito');
                setCarritoItems(carritoResponse.data);
            } catch (error) {
                console.error('Error al obtener carrito:', error);
            }
        };

        const fetchProductos = async () => {
            try {
                const productosResponse = await axios.get('http://localhost:8000/api/ropa');
                setProductos(productosResponse.data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchCarrito();
        fetchProductos();
    }, []);

    const calcularTotal = () => {
        let total = 0;
        for (const item of carritoItems) {
            const producto = productos.find((p) => p.id === item.producto_id);
            if (!producto) continue;
            total += producto.precio * item.cantidad;
        }
        return total.toFixed(2);
    };

    return (
        <div className="">
            <div className="flex justify-between text-lg font-medium text-gray-800 mb-2">
                <span>Total:</span>
                <span>{moneda}{calcularTotal()}</span>
            </div>
            <p className="text-sm text-gray-500">* El total no incluye envío</p>
        </div>
    );
};

export default CarritoTotal;