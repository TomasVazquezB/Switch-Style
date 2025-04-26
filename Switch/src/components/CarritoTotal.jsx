import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CarritoTotal = () => {
    const { moneda, delivery_fee, getCarritoCantidad } = useContext(ShopContext);

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{moneda} {getCarritoCantidad()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Envio gratis</p>
                    <p>{moneda} {delivery_fee}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{moneda} {getCarritoCantidad() === 0 ? 0 : getCarritoCantidad() + delivery_fee}.00</b>
                </div>
            </div>
        </div>
    )
}

export default CarritoTotal