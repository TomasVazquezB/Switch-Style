import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CarritoTotal = () => {
    const { moneda, delivery_fee, getCarritoAmount } = useContext(ShopContext);

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{moneda} {getCarritoAmount()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Envio gratis</p>
                    <p>{moneda} {delivery_fee}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{moneda} {getCarritoAmount() === 0 ? 0 : getCarritoAmount() + delivery_fee}.00</b>
                </div>
            </div>
        </div>
    )
}

export default CarritoTotal