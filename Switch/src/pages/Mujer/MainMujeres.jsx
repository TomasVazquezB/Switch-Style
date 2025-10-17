import React, { useEffect, useMemo, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import axios from '../../api/axios';
import './MainMujeres.css';

const BUCKET_BASE = (import.meta.env.VITE_ASSETS_BASE || '').replace(/\/+$/, '');
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="24" fill="#9ca3af">Sin imagen</text>
    </svg>`
  );

function toBucketUrl(rawPath) {
  if (!rawPath) return PLACEHOLDER;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  const key = String(rawPath)
    .replace(/^https?:\/\/[^/]+\/?/, '')
    .replace(/^\/+/, '')
    .replace(/^storage\//, '');
  return BUCKET_BASE ? `${BUCKET_BASE}/${encodeURI(key)}` : PLACEHOLDER;
}

const MainMujeres = () => {
  const [productos, setProductos] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [sortTipo, setSortTipo] = useState('relevante');
  const [precioMin] = useState(100);
  const [precioMax, setPrecioMax] = useState(350);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/ropa', { params: { genero: 'Mujer' } });
        setProductos(Array.isArray(res.data) ? res.data : []);
      } catch {
        setProductos([]);
      }
    })();
  }, []);

  const maxPrice = useMemo(() => {
    const precios = productos.map((p) => Number(p?.precio || 0));
    const max = Math.max(350, ...(precios.length ? precios : [0]));
    return Number.isFinite(max) ? max : 350;
  }, [productos]);

  useEffect(() => {
    setPrecioMax((prev) => (prev < maxPrice ? maxPrice : prev));
  }, [maxPrice]);

  const filtroProductos = useMemo(() => {
    let temp = [...productos];
    if (subCategoria.length > 0) temp = temp.filter((i) => subCategoria.includes(i?.categoria?.nombre));
    if (tallas.length > 0) temp = temp.filter((i) => i?.tallas?.some((t) => tallas.includes(t?.nombre)));
    temp = temp.filter((i) => Number(i.precio) >= precioMin && Number(i.precio) <= precioMax);
    if (sortTipo === 'low-high') temp.sort((a, b) => Number(a.precio) - Number(b.precio));
    else if (sortTipo === 'high-low') temp.sort((a, b) => Number(b.precio) - Number(a.precio));
    return temp;
  }, [productos, subCategoria, tallas, precioMin, precioMax, sortTipo]);

  const toggleSubCategoria = (e) => {
    const value = e.target.value;
    setSubCategoria((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const toggleTallaManual = (size) => {
    setTallas((prev) => (prev.includes(size) ? prev.filter((t) => t !== size) : [...prev, size]));
  };

  return (
    <div className="content">
      <section className="sidebar top-0 left-0 h-screen overflow-y-auto bg-white border-r px-4 py-6">
        <div className="sidebar-content">
          <div className="mb-4">
            <h4 className="mb-3">CATEGORIA</h4>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <label><input type="checkbox" value="Tops" onChange={toggleSubCategoria}/> Tops</label>
              <label><input type="checkbox" value="Pantalones" onChange={toggleSubCategoria}/> Pantalones</label>
              <label><input type="checkbox" value="Vestidos" onChange={toggleSubCategoria}/> Vestidos</label>
            </div>
          </div>

          <hr className="my-4"/>

          <div className="mb-4">
            <h4 className="mb-3">TALLA</h4>
            <div className="flex flex-wrap gap-3 text-sm font-light text-gray-700">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleTallaManual(size)}
                  className={`px-4 py-2 border rounded-full text-sm ${
                    tallas.includes(size)
                      ? 'bg-black text-white border-black hover:bg-gray-800'
                      : 'bg-white text-black border-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-4"/>

          <div className="mb-4">
            <h4>PRECIO</h4>
            <div className="range flex items-center gap-2">
              <span>${precioMin}</span>
              <input
                type="range"
                min={precioMin}
                max={maxPrice}
                step="10"
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="w-full"
              />
              <span>${precioMax}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="main pl-[220px] px-8 py-2">
        <div className="flex justify-end mb-3">
          <select
            value={sortTipo}
            onChange={(e) => setSortTipo(e.target.value)}
            className="border border-gray-300 text-sm px-2 py-1 rounded"
          >
            <option value="relevante">Ordenar por: Relevante</option>
            <option value="low-high">Ordenar por: de menor a mayor</option>
            <option value="high-low">Ordenar por: mayor a menor</option>
          </select>
        </div>

        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtroProductos.map((item) => {
            const raw = item.imagen_url || item.ruta || item.ruta_imagen || item?.imagenes?.[0]?.ruta || '';
            const imageUrl = toBucketUrl(raw);
            return (
              <ProductoItem
                key={item.id}
                id={item.id}
                img={imageUrl}
                nombre={item.titulo}
                precio={item.precio}
                tipo="ropa"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainMujeres;