import React, { useContext, useEffect, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import { ShopContext } from '../../context/ShopContext';
import './MainKids.css'

const MainKids = () => {
    const { productos, search, showSearch } = useContext(ShopContext);
    const [filtroProductos, setFiltroProductos] = useState([]);
    const [categoria] = useState(['Chicos']);
    const [subCategoria, setSubCategoria] = useState([]);
    const [sortTipo, setSortTipo] = useState('relavent');
    const [tallas, setTallas] = useState([]);
    const [precioMax, setPrecioMax] = useState(350);
    const [precioMin, setPrecioMin] = useState(100);

    // Cálculo del precio máximo de los productos
    const maxPrice = Math.max(...productos.map((item) => item.precio), 350);

    const toggleSubCategoria = (e) => {
        if (subCategoria.includes(e.target.value)) {
            setSubCategoria((prev) => prev.filter((a) => a !== e.target.value));
        } else {
            setSubCategoria((prev) => [...prev, e.target.value]);
        }
    };

    const toggleTalla = (e) => {
        const tallaSeleccionada = e.target.value;

        if (tallas.includes(tallaSeleccionada)) {
            setTallas((prev) => prev.filter((t) => t !== tallaSeleccionada));
        } else {
            setTallas((prev) => [...prev, tallaSeleccionada]);
        }
    };

    const toggleTallaManual = (size) => {
        if (tallas.includes(size)) {
            setTallas((prev) => prev.filter((s) => s !== size));
        } else {
            setTallas((prev) => [...prev, size]);
        }
    };

    const applyFiltro = () => {
        let productosCopy = productos.slice();

        if (showSearch && search) {
            productosCopy = productosCopy.filter((item) =>
                item.nombre.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (categoria.length > 0) {
            productosCopy = productosCopy.filter((item) => categoria.includes(item.categoria));
        }

        if (subCategoria.length > 0) {
            productosCopy = productosCopy.filter((item) => subCategoria.includes(item.subCategoria));
        }

        if (tallas.length > 0) {
            productosCopy = productosCopy.filter((item) => {
                if (Array.isArray(item.talla)) {
                    return item.talla.some((t) => tallas.includes(t));
                }
                return tallas.includes(item.talla);
            });
        }

        // Filtro de precio
        productosCopy = productosCopy.filter(
            (item) => item.precio >= precioMin && item.precio <= precioMax
        );

        setFiltroProductos(productosCopy);
    };

    const sortProducto = async () => {
        let fpCopy = filtroProductos.slice();

        switch (sortTipo) {
            case 'low-high':
                setFiltroProductos(fpCopy.sort((a, b) => a.precio - b.precio));
                break;

            case 'high-low':
                setFiltroProductos(fpCopy.sort((a, b) => b.precio - a.precio));
                break;

            default:
                applyFiltro();
                break;
        }
    };

    useEffect(() => {
        applyFiltro();
    }, [categoria, subCategoria, search, showSearch, tallas, precioMin, precioMax]);

    useEffect(() => {
        sortProducto();
    }, [sortTipo]);

    return (
        <div className="content">
            <section className="sidebar fixed top-0 left-0 h-screen overflow-y-auto">
                <div className="sidebar-content">
                    <div className="mb-4">
                        <h4 className="mb-3">CATEGORIA</h4> {/* <<< Add margin-bottom here instead of <br /> */}
                        <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                            <p className="flex gap-2">
                                <input className="w-3" value={"Remeras"} onChange={toggleSubCategoria} type="checkbox" /> Remeras
                            </p>
                            <p className="flex gap-2">
                                <input className="w-3" value={"Pantalones"} onChange={toggleSubCategoria} type="checkbox" /> Pantalones
                            </p>
                            <p className="flex gap-2">
                                <input className="w-3" value={"Camperas"} onChange={toggleSubCategoria} type="checkbox" /> Camperas
                            </p>
                        </div>
                    </div>


                    <hr />

                    <div className="mb-4">
                        <h4 className="mb-3">TALLA</h4>
                        <div className="flex flex-wrap gap-3 text-sm font-light text-gray-700">
                            {["S", "M", "L", "XL"].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleTallaManual(size)}
                                    className={`px-4 py-2 border rounded-full text-sm transition-colors duration-200 ${tallas.includes(size)
                                        ? 'bg-black text-white border-black hover:bg-gray-800'
                                        : 'bg-white text-black border-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>


                    <hr />

                    <div className="mb-4">
                        <h4 >PRECIO</h4>
                        <div className="range">
                            <div className="range-labels">
                                <span>${precioMin}&nbsp;</span>

                            </div>
                            <input
                                type="range"
                                id="priceRange"
                                min={precioMin}
                                max={maxPrice}
                                step="10"
                                value={precioMax}
                                onChange={(e) => setPrecioMax(e.target.value)}
                            />
                            <span>&nbsp;${precioMax}</span>
                        </div>
                    </div>

                    <br />

                </div>
            </section>

            <div className="main">
                <div className="row">
                    <div className="column">
                        <select onChange={(e) => setSortTipo(e.target.value)} className="border-2 border-gray-300 text-sm px-2">
                            <option value="relavente">Sort by: Relavente</option>
                            <option value="low-high">Sort by: Low to High</option>
                            <option value="high-low">Sort by: High to Low</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {filtroProductos.map((item, index) => (
                            <div style={{ padding: '20px', margin: '20px', border: '2px solid grey' }} key={index}>
                                <ProductoItem id={item._id} img={item.img} name={item.nombre} precio={item.precio} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MainKids;
