import React, { useEffect, useMemo, useState } from 'react';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import axios from '../../api/axios';
import './MainHombres.css';

/* ====== Imagen ====== */
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

/* ====== Tema global → estilo en BD ====== */
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

/* ====== UI data ====== */
const CATEGORIES_DB = [
  'Remeras',
  'Camisas',
  'Camperas',
  'Shorts',
  'Pantalónes', // como figura en tu BD
  'Faldas',
  'Vestidos',
  'Botas',
  'Zapatillas',
];
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

/* ====== Helpers usuario (front-only) ====== */
function pickUserName(respData) {
  // intenta varios formatos de respuesta comunes
  return (
    respData?.Nombre ||
    respData?.name ||
    respData?.usuario?.Nombre ||
    respData?.user?.name ||
    null
  );
}
function getUserIdFromProduct(p) {
  return (
    p?.ID_Usuario ??
    p?.id_usuario ??
    p?.usuario_id ??
    p?.user_id ??
    null
  );
}

const MainHombres = () => {
  const estilo = useThemeEstilo();

  const [productos, setProductos] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [sortTipo, setSortTipo] = useState('relevante');
  const [precioMin] = useState(100);
  const [precioMax, setPrecioMax] = useState(350);

  // cache de nombres de usuario { [id]: 'Nombre' | null }
  const [uploaderNames, setUploaderNames] = useState({});

  /* ====== Fetch de productos (no requiere cambios de backend) ====== */
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await axios.get('/ropa', {
          params: {
            genero: 'Hombre',
            estilo,                        // 'oscuro' | 'claro'
            categorias: subCategoria,      // array de nombres
            tallas,                        // ['S', 'M', ...]
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
        console.error('❌ Error al obtener productos:', e);
        if (!cancel) setProductos([]);
      }
    })();
    return () => { cancel = true; };
  }, [estilo, subCategoria, tallas, sortTipo]);

  /* ====== Lazy-load de nombres de usuario (front only) ====== */
  useEffect(() => {
    const ids = Array.from(
      new Set(productos.map(getUserIdFromProduct).filter((v) => v != null))
    );
    const toFetch = ids.filter((id) => uploaderNames[id] === undefined);
    if (toFetch.length === 0) return;

    let cancelled = false;

    (async () => {
      const newMap = {};
      for (const id of toFetch) {
        let nombre = null;
        // probamos varios endpoints típicos sin romper nada del back existente
        const endpoints = [
          `/usuario/${id}`,
          `/usuarios/${id}`,
          `/api/usuario/${id}`,
          `/api/usuarios/${id}`,
        ];
        for (const url of endpoints) {
          try {
            const r = await axios.get(url);
            const data = Array.isArray(r.data) ? r.data[0] : r.data;
            const maybe = pickUserName(data);
            if (maybe) { nombre = maybe; break; }
          } catch (_) {
            /* probar siguiente */
          }
        }
        newMap[id] = nombre ?? null;
      }
      if (!cancelled) setUploaderNames((prev) => ({ ...prev, ...newMap }));
    })();

    return () => { cancelled = true; };
  }, [productos, uploaderNames]);

  /* ====== Precio máximo dinámico ====== */
  const maxPrice = useMemo(() => {
    const precios = productos.map((p) => Number(p?.precio || 0));
    const max = Math.max(350, ...(precios.length ? precios : [0]));
    return Number.isFinite(max) ? max : 350;
  }, [productos]);

  useEffect(() => {
    setPrecioMax((prev) => (prev < maxPrice ? maxPrice : prev));
  }, [maxPrice]);

  /* ====== Filtro final en front (precio y orden) ====== */
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

  /* ====== Handlers filtros ====== */
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
    <div className="content">
      {/* Sidebar */}
      <section className="sidebar top-0 left-0 h-screen overflow-y-auto bg-white dark:bg-gray-900 border-r px-4 py-6">
        <div className="sidebar-content">
          {/* Categoría */}
          <div className="mb-4">
            <h4 className="mb-3">CATEGORIA</h4>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-200">
              {CATEGORIES_DB.map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input type="checkbox" value={cat} onChange={toggleSubCategoria} />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          {/* Talla */}
          <div className="mb-4">
            <h4 className="mb-3">TALLA</h4>
            <div className="flex flex-wrap gap-3 text-sm font-light text-gray-700 dark:text-gray-200">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleTallaManual(size)}
                  className={`px-4 py-2 border rounded-full text-sm transition-colors duration-200 ${
                    tallas.includes(size)
                      ? 'bg-black text-white border-black hover:bg-gray-800 dark:bg-white dark:text-black dark:border-white'
                      : 'bg-white text-black border-gray-400 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          {/* Precio */}
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

      {/* Grid de productos */}
      <div className="main pl-[220px] px-8 py-2">
        <div className="flex justify-end mb-3">
          <select
            value={sortTipo}
            onChange={(e) => setSortTipo(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1 rounded"
          >
            <option value="relevante">Ordenar por: Relevante</option>
            <option value="low-high">Ordenar por: de menor a mayor</option>
            <option value="high-low">Ordenar por: mayor a menor</option>
          </select>
        </div>

        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtroProductos.map((item) => {
            const rawPath =
              item.imagen_url || item.ruta || item.ruta_imagen || item?.imagenes?.[0]?.ruta || '';
            const imageUrl = toRopaImageUrl(rawPath);

            const userId = getUserIdFromProduct(item);
            const uploader =
              userId == null
                ? null
                : (uploaderNames[userId] ?? `Usuario #${userId}`);

            return (
              <article
                key={item.id}
                className="rounded border overflow-hidden bg-white dark:bg-gray-800 transition"
              >
                <ProductoItem
                  id={item.id}
                  img={imageUrl}
                  nombre={item.titulo}
                  precio={item.precio}
                  tipo="ropa"
                />
                <div className="px-4 pb-3">
                  {uploader && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Subido por: {uploader}
                    </p>
                  )}
                </div>
              </article>
            );
          })}

          {!filtroProductos.length && (
            <p className="col-span-full text-sm opacity-70 dark:text-gray-300">
              No encontramos resultados con los filtros seleccionados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainHombres;
