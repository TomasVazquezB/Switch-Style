import { createContext, useEffect, useState } from "react";
import { productos } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const moneda = '$';
    const delivery_fee = 10;
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // ✅ Cargar carrito desde localStorage al iniciar
    const [carritoItems, setCarritoItems] = useState(() => {
        const dataGuardada = localStorage.getItem('carrito');
        return dataGuardada ? JSON.parse(dataGuardada) : {};
    });

    // ✅ Guardar carrito automáticamente en localStorage al cambiar
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carritoItems));
    }, [carritoItems]);

    const agregarAlCarrito = async (itemId, talla) => {
        if (!talla) {
            toast.error('Seleccione talla del producto');
            return;
        }

        let carritoData = structuredClone(carritoItems);

        if (carritoData[itemId]) {
            if (carritoData[itemId][talla]) {
                carritoData[itemId][talla] += 1;
            } else {
                carritoData[itemId][talla] = 1;
            }
        } else {
            carritoData[itemId] = {};
            carritoData[itemId][talla] = 1;
        }

        setCarritoItems(carritoData);
        toast.success('Producto agregado al carrito');
    };

    const quitarDelCarrito = (itemId, talla) => {
        let carritoData = structuredClone(carritoItems);

        if (carritoData[itemId] && carritoData[itemId][talla]) {
            carritoData[itemId][talla] -= 1;

            if (carritoData[itemId][talla] <= 0) {
                delete carritoData[itemId][talla];
            }

            if (Object.keys(carritoData[itemId]).length === 0) {
                delete carritoData[itemId];
            }

            setCarritoItems(carritoData);
        }
    };

    const updateCantidad = (itemId, talla, cantidad) => {
        let carritoData = structuredClone(carritoItems);

        if (!carritoData[itemId]) return;

        if (cantidad <= 0) {
            delete carritoData[itemId][talla];

            if (Object.keys(carritoData[itemId]).length === 0) {
                delete carritoData[itemId];
            }

            toast.info('Producto eliminado del carrito');
        } else {
            carritoData[itemId][talla] = cantidad;
            toast.success('Cantidad actualizada');
        }

        setCarritoItems(carritoData);
    };

    const getCarritoCount = () => {
        let totalCount = 0;
        for (const items in carritoItems) {
            for (const item in carritoItems[items]) {
                try {
                    if (carritoItems[items][item] > 0) {
                        totalCount += carritoItems[items][item];
                    }
                } catch (error) { }
            }
        }
        return totalCount;
    };

    const getCarritoCantidad = () => {
        let totalCantidad = 0;
        for (const id in carritoItems) {
            const producto = productos.find(p => p._id === id);
            if (!producto) continue;

            for (const talla in carritoItems[id]) {
                const cantidad = carritoItems[id][talla];
                totalCantidad += producto.precio * cantidad;
            }
        }
        return totalCantidad;
    };

    // ✅ Función para limpiar el carrito (opcional)
    const limpiarCarrito = () => {
        setCarritoItems({});
        toast.info("Carrito vaciado");
    };

    const value = {
        moneda,
        delivery_fee,
        productos,
        navigate,
        search, setSearch,
        showSearch, setShowSearch,
        agregarAlCarrito,
        quitarDelCarrito,
        updateCantidad,
        carritoItems,
        getCarritoCount,
        getCarritoCantidad,
        limpiarCarrito // ✅ Exportamos también
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
