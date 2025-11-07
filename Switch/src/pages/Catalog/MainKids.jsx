import React, { useEffect, useMemo, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import { publicApi } from '../../api/axios';
import './MainCatalog.css';

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

function toRopaImageUrl(rawPath) {
  if (!rawPath) return PLACEHOLDER;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  let key = String(rawPath)
    .replace(/^https?:\/\/[^/]+\/?/, '')
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')
    .replace(/^imagenes\/ropa\//, '')
    .replace(/^imagenes\//, '')
    .replace(/^ropa\//, '');
  return BUCKET_BASE ? `${BUCKET_BASE}/ropa/${encodeURI(key)}` : PLACEHOLDER;
}

const CATEGORIES_DB = [
  'Remeras',
  'Camisas',
  'Camperas',
  'Shorts',
  'Pantalones',
  'Faldas',
  'Vestidos',
  'Zapatillas',
];

const ALL_SIZES = ['S', 'M', 'L', 'XL'];

const MainKids = ({ darkMode }) => {
  const [productos, setProductos] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [sortTipo, setSortTipo] = useState('relevante');
  const [precioMin] = useState(100);
  const [precioMax, setPrecioMax] = useState(350);

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        const res = await publicApi.get('/ropa', {
          params: {
            theme: darkMode ? 'dark' : 'light',
            genero: 'Chicos',
            categorias: subCategoria,
            tallas,
            orden:
              sortTipo === 'low-high'
                ? 'precio_asc'
                : sortTipo === 'high-low'
                ? 'precio_desc'
                : 'relevante',
          },
        });
        if (!cancel) setProductos(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error al obtener productos (Chicos):', error);
        if (!cancel) setProductos([]);
      }
    }
    fetchData();
    return () => {
      cancel = true;
    };
  }, [darkMode, subCategoria, tallas, sortTipo]);

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

    temp = temp.filter((item) => {
      const precio = Number(item?.precio || 0);
      return precio >= precioMin && precio <= Number(precioMax);
    });

    if (sortTipo === 'low-high') {
      temp.sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (sortTipo === 'high-low') {
      temp.sort((a, b) => Number(b.precio) - Number(a.precio));
    }

    return temp;
  }, [productos, precioMin, precioMax, sortTipo]);

  const toggleSubCategoria = (e) => {
    const value = e.target.value;
    setSubCategoria((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const toggleTallaManual = (size) => {
    setTallas((prev) =>
      prev.includes(size) ? prev.filter((t) => t !== size) : [...prev, size]
    );
  };

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <div className="filter-group">
          <h4>CATEGORIA</h4>
          <div className="filter-categorias">
            {CATEGORIES_DB.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  value={cat}
                  onChange={toggleSubCategoria}
                  checked={subCategoria.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>TALLA</h4>
          <div className="filter-tallas">
            {ALL_SIZES.map((size) => (
              <div
                key={size}
                onClick={() => toggleTallaManual(size)}
                className={`size-option ${tallas.includes(size) ? 'active' : ''}`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>PRECIO</h4>
          <div className="price-row">
            <span>${precioMin}</span>
            <span>${precioMax}</span>
          </div>
          <input
            type="range"
            min={precioMin}
            max={maxPrice}
            step="10"
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
          />
        </div>
      </aside>

      <section className="main">
        <div className="main-header">
          <select
            value={sortTipo}
            onChange={(e) => setSortTipo(e.target.value)}
          >
            <option value="relevante">ORDENAR POR: RELEVANTE</option>
            <option value="low-high">ORDENAR POR: DE MENOR A MAYOR</option>
            <option value="high-low">ORDENAR POR: MAYOR A MENOR</option>
          </select>
        </div>

        <div className="products-grid">
          {filtroProductos.map((item) => {
            const rawPath =
              item.imagen_url ||
              item.ruta ||
              item.ruta_imagen ||
              (item.imagenes && item.imagenes[0] && item.imagenes[0].ruta) ||
              '';
            const imageUrl = toRopaImageUrl(rawPath);

            const uploader =
              (item.usuario && item.usuario.Nombre) ||
              (item.user && item.user.name) ||
              item.usuario_nombre ||
              null;

            const tituloConUploader = (
              <div className="product-card-body">
                <div className="product-card-title">{item.titulo}</div>
                {uploader && (
                  <div className="product-card-meta">
                    Subido por: {uploader}
                  </div>
                )}
              </div>
            );

            return (
              <article key={item.id} className="product-card">
                <ProductoItem
                  id={item.id}
                  img={imageUrl}
                  nombre={tituloConUploader}
                  precio={item.precio}
                  tipo="ropa"
                />
              </article>
            );
          })}

          {!filtroProductos.length && (
            <p className="col-span-full text-sm opacity-70">
              No encontramos resultados con los filtros seleccionados
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MainKids;
