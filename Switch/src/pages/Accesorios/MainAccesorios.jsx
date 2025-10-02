import React, { useEffect, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import axios from '../../api/axios'; 
import './MainAccesorios.css';u

const MainAccesorios = () => {
    const [productos, setProductos] = useState([]);
    const [filtroProductos, setFiltroProductos] = useState([]);
    const [sortTipo, setSortTipo] = useState('relavente');
    const [precioMin] = useState(100);
    const [precioMax, setPrecioMax] = useState(350);

    const fetchAccesorios = async () => {
        try {
            const res = await axios.get('/accesorios');
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

    useEffect(() => { aplicarFiltros(); }, [precioMax]);
    useEffect(() => { ordenar(); }, [sortTipo]);

    const maxPrice = productos.length > 0 ? Math.max(...productos.map(p => p.precio || 0)) : 350;

    return (
        <div className="content">
            <section className="sidebar fixed top-0 left-0 h-screen overflow-y-auto bg-white border-r px-4 py-6">
                <div className="sidebar-content">
                    <div className="mb-4">
                        <h4 className="mb-3">PRECIO</h4>
                        <div className="range">
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
                </div>
            </section>

            <div className="main pl-[220px] px-8 py-6">
                <div className="flex justify-end mb-2">
                    <select onChange={(e) => setSortTipo(e.target.value)} className="border border-gray-300 text-sm px-2 py-1 rounded">
                        <option value="relavente">Ordenar por: Relevante</option>
                        <option value="low-high">Ordenar por: de menor a mayor</option>
                        <option value="high-low">Ordenar por: mayor a menor</option>
                    </select>
                </div>

                <div className="product-grid">
                    {filtroProductos.map((item) => {
                        const imageUrl = item.ruta_imagen?.startsWith('http') 
                            ? item.ruta_imagen 
                            : `${axios.defaults.baseURL}/storage/${item.ruta_imagen}`;
                        return (
                            <ProductoItem 
                                key={item.id} 
                                id={item.id} 
                                img={imageUrl} 
                                nombre={item.titulo} 
                                precio={item.precio} 
                                tipo="accesorios"
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MainAccesorios;