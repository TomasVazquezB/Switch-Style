import React, { useEffect, useMemo, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import { publicApi } from '../../api/axios';
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

// Igual que en Hombres: normalizamos la ruta al bucket "ropa/"
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

// Lee el theme actual y lo mapea a estilo (claro/oscuro)
function getThemeAsEstilo() {
  const ls = (localStorage.getItem('theme') || '').toLowerCase();
  const isDark = ls === 'dark' || document.documentElement.classList.contains('dark');
  return isDark ? 'oscuro' : 'claro';
}
function useThemeEstilo() {
  const [estilo, setEstilo] = useState(getThemeAsEstilo());
  useEffect(() => {
    const sync = () => setEstilo(getThemeAsEstilo());
    window.addEventListener('storage', sync);
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('storage', sync);
      mo.disconnect();
    };
  }, []);
  return estilo;
}

// Lista de categorías (podés ajustarla a las de tu DB)
const CATEGORIES_DB = [
  'Remeras',
  'Camisas',
  'Camperas',
  'Shorts',
  'Pantalones',
  'Faldas',
  'Vestidos',
  'Botas',
  'Zapatillas',
];

// Tallas típicas para mujeres (ajustá si querés agregar XS/XXL)
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const MainMujeres = () => {
  const estilo = useThemeEstilo();

  const [productos, setProductos] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]); // array de nombres de categoría
  const [tallas, setTallas] = useState([]); // array de nombres de talla
  const [sortTipo, setSortTipo] = useState('relevante');
  const [precioMin] = useState(100);
  const [precioMax, setPrecioMax] = useState(350);

  // Trae del backend con los mismos params que Hombres
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await publicApi.get('/ropa', {
          params: {
            genero: 'Mujer',
            estilo,
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
      } catch (e) {
        console.error('❌ Error al obtener productos (Mujeres):', e);
        if (!cancel) setProductos([]);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [estilo, subCategoria, tallas, sortTipo]);

  // Precio máximo dinámico
  const maxPrice = useMemo(() => {
    const precios = productos.map((p) => Number(p?.precio || 0));
    const max = Math.max(350, ...(precios.length ? precios : [0]));
    return Number.isFinite(max) ? max : 350;
  }, [productos]);

  useEffect(() => {
    setPrecioMax((prev) => (prev < maxPrice ? maxPrice : prev));
  }, [maxPrice]);

  // Filtro local de precio + orden (lo demás ya viene filtrado del backend)
  const filtroProductos = useMemo(() => {
    let temp = [...productos];

    temp = temp.filter((item) => {
      const precio = Number(item?.precio || 0);
      return precio >= precioMin && precio <= Number(precioMax);
    });

    if (sortTipo === 'low-high') temp.sort((a, b) => Number(a.precio) - Number(b.precio));
    else if (sortTipo === 'high-low') temp.sort((a, b) => Number(b.precio) - Number(a.precio));

    return temp;
  }, [productos, precioMin, precioMax, sortTipo]);

  // Handlers UI
  const toggleSubCategoria = (e) => {
    const value = e.target.value;
    setSubCategoria((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
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
              {CATEGORIES_DB.map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input type="checkbox" className='me-2' value={cat} onChange={toggleSubCategoria} />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          <div className="mb-4">
            <h4 className="mb-3">TALLA</h4>
            <div className="flex flex-wrap gap-3 text-sm font-light text-gray-700">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleTallaManual(size)}
                  className={`px-4 py-2 border rounded-full text-sm transition-colors duration-200 ${
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

          <hr className="my-4" />

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
            const rawPath =
              item.imagen_url ||
              item.ruta ||
              item.ruta_imagen ||
              item?.imagenes?.[0]?.ruta ||
              '';
            const imageUrl = toRopaImageUrl(rawPath);

            const uploader =
              item?.usuario?.Nombre ??
              item?.user?.name ??
              item?.usuario_nombre ??
              null;

            // Título grande + “Subido por” gris claro (va antes del precio)
            const tituloConUploader = (
              <div className="titulo-bloque">
                <span className="titulo-ropa">{item.titulo}</span>
                {uploader && <span className="subido-por">Subido por: {uploader}</span>}
              </div>
            );

            return (
              <article
                key={item.id}
                className="rounded border overflow-hidden bg-white transition"
              >
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
      </div>
    </div>
  );
};

export default MainMujeres;
