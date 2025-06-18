import React from 'react';
import './CarritoTotal.css';

const CarritoTotal = ({ total, moneda }) => {
    return (
        <div>
            <div className="flex justify-between text-lg font-medium text-gray-800 mb-2">
                <span>Total:</span>
                <span>{moneda}{total}</span>
            </div>
            <p className="text-sm text-gray-500">* El total no incluye envío</p>
        </div>
    );
};

export default CarritoTotal;
