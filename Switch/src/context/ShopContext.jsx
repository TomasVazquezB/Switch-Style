import { createContext, useEffect, useState } from "react";
import { productos } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const moneda = '$';
    const delivery_fee = 10;
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [carritoItems, setCarritoItems] = useState({});

    const agregarAlCarrito = async (itemId, talla) => {

        if (!talla) {
            toast.error('Seleccione talla del producto');
            return;
        }

        let carritoData = structuredClone(carritoItems);

        if (carritoData[itemId]) {
            if (carritoData[itemId][talla]) {
                carritoData[itemId][talla] += 1;
            }
            else {
                carritoData[itemId][talla] = 1;
            }
        }
        else {
            carritoData[itemId] = {};
            carritoData[itemId][talla] = 1
        }
        setCarritoItems(carritoData)

    }

    const updateCantidad = async (itemId, talla, cantidad) => {
        let carritoData = structuredClone(carritotItems);
        carritoData[itemId][talla] = cantidad;
        setCarritoItems(carritoData);
    }

    const getCarritoCount = () => {
        let totalCount = 0;
        for (const items in carritoItems) {
            for (const item in carritoItems[items]) {
                try {
                    if (carritoItems[items][item] > 0) {
                        totalCount += carritoItems[items][item];
                    }
                } catch (error) {
                }
            }
        }
        return totalCount;
    }

    const getCarritoCantidad = () => {
        let totalCantidad = 0;
        for (const items in carritoItems) {
            let itemInfo = products.find((producto) => producto._id === items);
            for (const item in carritoItems[items]) {
                try {
                    if (carritoItems[items][item] > 0) {
                        totalCantidad += itemInfo.price * carritoItems[items][item];
                    }
                } catch (error) {
                }
            }
        }
        return totalCantidad;
    }

    const value = {
        moneda, delivery_fee,
        productos,
        navigate,
        search, setSearch,
        showSearch, setShowSearch,
        agregarAlCarrito, updateCantidad,
        carritoItems,
        getCarritoCount, getCarritoCantidad

    }

    return (<ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>)
}

export default ShopContextProvider;