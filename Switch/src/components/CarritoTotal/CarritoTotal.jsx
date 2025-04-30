import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext.jsx';
import './CarritoTotal.css'

const CarritoTotal = () => {
    const { carritoItems, productos, moneda } = useContext(ShopContext);

    const calcularTotal = () => {
        let total = 0;
        for (const productoId in carritoItems) {
            const item = productos.find((p) => p._id === productoId);
            if (!item) continue;

            for (const talla in carritoItems[productoId]) {
                const cantidad = carritoItems[productoId][talla];
                total += item.precio * cantidad;
            }
        }
        return total;
    };

    return (
        <div className="border p-4 rounded-md bg-gray-50">
            <div className="flex justify-between mb-2">
                <p>Total:</p>
                <p className="font-semibold">{moneda}{calcularTotal()}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">* El total no incluye envío</p>
        </div>
    );
};

export default CarritoTotal;
