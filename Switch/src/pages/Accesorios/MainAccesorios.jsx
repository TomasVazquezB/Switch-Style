import React, { useEffect, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import axios from 'axios';

const MainAccesorios = () => {
    const [productos, setProductos] = useState([]);
    const [filtroProductos, setFiltroProductos] = useState([]);
    const [sortTipo, setSortTipo] = useState('relavente');
    const [precioMin] = useState(100);
    const [precioMax, setPrecioMax] = useState(350);

    const fetchAccesorios = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/accesorios');
            setProductos(res.data);
            setFiltroProductos(res.data);
        } catch (error) {
            console.error("Error al obtener accesorios:", error);
        }
    };

    useEffect(() => {
        fetchAccesorios();
    }, []);

    const aplicarFiltros = () => {
        let temp = [...productos];
        temp = temp.filter(item => item.precio >= precioMin && item.precio <= precioMax);
        setFiltroProductos(temp);
    };

    const ordenar = () => {
        const ordenados = [...filtroProductos];
        if (sortTipo === 'low-high') {
            ordenados.sort((a, b) => a.precio - b.precio);
        } else if (sortTipo === 'high-low') {
            ordenados.sort((a, b) => b.precio - a.precio);
        }
        setFiltroProductos(ordenados);
    };

    useEffect(() => {
        aplicarFiltros();
    }, [precioMax]);

    useEffect(() => {
        ordenar();
    }, [sortTipo]);

    const maxPrice = productos.length > 0
        ? Math.max(...productos.map(p => p.precio || 0))
        : 350;

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-[220px] h-screen sticky top-0 bg-white border-r px-4 py-6">
                <div>
                    <h4 className="text-lg font-bold mb-4">PRECIO</h4>
                    <div className="flex items-center gap-2 text-sm">
                        <span>${precioMin}</span>
                        <input
                            type="range"
                            min={precioMin}
                            max={maxPrice}
                            step="10"
                            value={precioMax}
                            onChange={(e) => setPrecioMax(e.target.value)}
                            className="w-full"
                        />
                        <span>${precioMax}</span>
                    </div>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 px-8 py-6">
                <div className="flex justify-end mb-4">
                    <select
                        onChange={(e) => setSortTipo(e.target.value)}
                        className="border border-gray-300 text-sm px-2 py-1 rounded"
                    >
                        <option value="relavente">Sort by: Relevante</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filtroProductos.map(item => (
                        <ProductoItem
                            key={item.id}
                            id={item.id}
                            img={item.ruta_imagen}
                            nombre={item.titulo}
                            precio={item.precio}
                            tipo="accesorios"
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MainAccesorios;
