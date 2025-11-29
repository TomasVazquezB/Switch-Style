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

function toAccesorioImageUrl(rawPath) {
  if (!rawPath) return PLACEHOLDER;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  let key = String(rawPath)
    .replace(/^https?:\/\/[^/]+\/?/, '')
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')
    .replace(/^imagenes\/accesorios\//, '')
    .replace(/^imagenes\//, '')
    .replace(/^accesorios\//, '');
  return BUCKET_BASE ? `${BUCKET_BASE}/accesorios/${encodeURIComponent(key)}` : PLACEHOLDER;
}

const CATEGORIES_DB = ['Anillos', 'Collares', 'Aritos', 'Carteras y Mochilas', 'Cinturones', 'Billeteras', 'Gorras'];

const MainAccesorios = ({ darkMode }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sortTipo, setSortTipo] = useState('relevante');
  const [precioMin] = useState(100);
  const [precioMax, setPrecioMax] = useState(350);

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const res = await publicApi.get('/accesorios', {
          params: {
            theme: darkMode ? 'dark' : 'light',
          },
        });

        if (!cancel) {
          setProductos(Array.isArray(res.data) ? res.data : []);
        }
      } catch (e) {
        console.error('Error al obtener accesorios:', e);
        if (!cancel) setProductos([]);
      }
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, [darkMode]);

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

    if (categorias.length > 0) {
      temp = temp.filter((item) => {
        const nombreCat = item?.categoria?.nombre || item?.categoria_nombre || '';
        return categorias.includes(nombreCat);
      });
    }

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
  }, [productos, categorias, precioMin, precioMax, sortTipo]);

  const toggleCategoria = (e) => {
    const value = e.target.value;
    setCategorias((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
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
                  onChange={toggleCategoria}
                  checked={categorias.includes(cat)}
                />
                {cat}
              </label>
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
          {filtroProductos.map((item, index) => {
            const rawPath =
              item.imagen_url ||
              item.ruta ||
              item.ruta_imagen ||
              (item.imagenes && item.imagenes[0] && item.imagenes[0].ruta) ||
              '';
            const imageUrl = toAccesorioImageUrl(rawPath);

            const uploader =
              (item.usuario && item.usuario.Nombre) ||
              (item.user && item.user.name) ||
              item.usuario_nombre ||
              null;

            const tituloConUploader = (
              <div className="product-card-body">
                <div className="product-card-title">{item.titulo}</div>
                {uploader && (
                  <div className="product-card-meta">Subido por: {uploader}</div>
                )}
              </div>
            );

            const eager = index < 8;

            return (
              <article key={item.id} className="product-card">
                <ProductoItem
                  id={item.id}
                  img={imageUrl}
                  nombre={tituloConUploader}
                  precio={item.precio}
                  tipo="accesorio"
                  eager={eager}
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

export default MainAccesorios;
