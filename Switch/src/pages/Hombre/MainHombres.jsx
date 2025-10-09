import React, { useEffect, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import axios from '../../api/axios'; 
import './MainHombres.css';

const MainHombres = ({ darkMode }) => {
  const [productos, setProductos] = useState([]);
  const [filtroProductos, setFiltroProductos] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [sortTipo, setSortTipo] = useState('relavente');
  const [precioMin] = useState(100);
  const [precioMax, setPrecioMax] = useState(350);

  const [favoritos, setFavoritos] = useState(() => {
    const stored = localStorage.getItem("favoritos");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorito = (id) => {
    setFavoritos((prev) => {
      let nuevos;
      if (prev.includes(id)) {
        nuevos = prev.filter((favId) => favId !== id);
      } else {
        nuevos = [...prev, id];
      }
      localStorage.setItem("favoritos", JSON.stringify(nuevos));
      return nuevos;
    });
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get('/ropa', { params: { genero: 'Hombre' } });

      const productosConRuta = res.data.map(prod => {
        let imagenPrincipal = prod.ruta_imagen || 'placeholder.png';

        if (!imagenPrincipal.startsWith('http')) {
          imagenPrincipal = `${axios.defaults.baseURL}/storage/${imagenPrincipal}`;
        }

        if (darkMode && prod.imagen_nocturna) {
          imagenPrincipal = `${axios.defaults.baseURL}/storage/${prod.imagen_nocturna}`;
        }

        return { ...prod, ruta_imagen: imagenPrincipal };
      });

      setProductos(productosConRuta);
      setFiltroProductos(productosConRuta);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [darkMode]); 

  const toggleSubCategoria = (e) => {
    const value = e.target.value;
    setSubCategoria(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const toggleTallaManual = (size) => {
    setTallas(prev => prev.includes(size) ? prev.filter(t => t !== size) : [...prev, size]);
  };

  const applyFiltro = () => {
    let temp = [...productos];

    if (subCategoria.length > 0) {
      temp = temp.filter(item => subCategoria.includes(item.categoria?.nombre));
    }

    if (tallas.length > 0) {
      temp = temp.filter(item => item.tallas?.some(t => tallas.includes(t.nombre)));
    }

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

  useEffect(() => { applyFiltro(); }, [subCategoria, tallas, precioMax, productos]);
  useEffect(() => { ordenar(); }, [sortTipo]);

  const maxPrice = productos.length > 0 ? Math.max(...productos.map((p) => p.precio || 0)) : 350;

  return (
    <div className="content">
      <section className="sidebar fixed top-0 left-0 h-screen overflow-y-auto bg-white border-r px-4 py-6">
        <div className="sidebar-content">
          <div className="mb-4">
            <h4 className="mb-3">CATEGORIA</h4>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <label><input type="checkbox" value="Remeras" onChange={toggleSubCategoria} /> Remeras</label>
              <label><input type="checkbox" value="Pantalones" onChange={toggleSubCategoria} /> Pantalones</label>
              <label><input type="checkbox" value="Camperas" onChange={toggleSubCategoria} /> Camperas</label>
            </div>
          </div>

          <hr className="my-4" />
          <div className="mb-4">
            <h4 className="mb-3">TALLA</h4>
            <div className="flex flex-wrap gap-3 text-sm font-light text-gray-700">
              {["S","M","L","XL"].map(size => (
                <button key={size} type="button" onClick={() => toggleTallaManual(size)}
                  className={`px-4 py-2 border rounded-full text-sm transition-colors duration-200 ${tallas.includes(size) ? 'bg-black text-white border-black hover:bg-gray-800' : 'bg-white text-black border-gray-400 hover:bg-gray-100'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-4" />
          <div className="mb-4">
            <h4>PRECIO</h4>
            <div className="range">
              <span>${precioMin}</span>
              <input type="range" min={precioMin} max={maxPrice} step="10" value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} className="w-full"/>
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
          {filtroProductos.map(item => (
            <ProductoItem
              key={item.id}
              id={item.id}
              img={item.ruta_imagen}
              nombre={item.titulo}
              precio={item.precio}
              tipo="ropa"
              esFavorito={favoritos.includes(item.id)}
              onToggleFavorito={() => toggleFavorito(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainHombres;