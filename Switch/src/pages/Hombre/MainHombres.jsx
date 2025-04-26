import React, { useContext, useEffect, useState } from 'react'
import ProductoItem from '../../components/Productoitem/ProductoItem'
import { ShopContext } from '../../context/ShopContext'
import { assets } from '../../assets/assets'

const MainHombres = () => {

  const { productos, search, showSearch } = useContext(ShopContext);
  const [filtroProductos, setFiltroProductos] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]);
  const [showFiltro, setShowFiltro] = useState(false);
  const [sortTipo, setSortTipo] = useState('relavent')

  const toggleCategoria = (e) => {

    if (categoria.includes(e.target.value)) {
      setCategoria(prev => prev.filter(a => a !== e.target.value))
    }
    else {
      setCategoria(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategoria = (e) => {

    if (subCategoria.includes(e.target.value)) {
      setSubCategoria(prev => prev.filter(a => a !== e.target.value))
    }
    else {
      setSubCategoria(prev => [...prev, e.target.value])
    }

  }

  const applyFiltro = () => {

    let productosCopy = productos.slice()

    if (showSearch && search) {
      productosCopy = productosCopy.filter(item => item.nombre.toLowerCase().includes(search.toLowerCase()))
    }

    if (categoria.length > 0) {
      productosCopy = productosCopy.filter(item => categoria.includes(item.categoria));
    }

    if (subCategoria.length > 0) {
      productosCopy = productosCopy.filter(item => subCategoria.includes(item.subCategoria));
    }

    setFiltroProductos(productosCopy)

  }

  const sortProducto = async () => {

    let fpCopy = filtroProductos.slice();

    switch (sortTipo) {
      case 'low-high':
        setFiltroProductos(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFiltroProductos(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default:
        applyFiltro();
        break;
    }

  }

  useEffect(() => {applyFiltro() }, [categoria, subCategoria, search, showSearch])

  useEffect(() => {sortProducto();}, [sortTipo])

  return (
    <div className="content">
      <section className="sidebar">
        <div class="sidebar-content">
          <p onClick={() => setShowFiltro(!showFiltro)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTROS<img className={`h-3 sm:hidden ${showFiltro ? ' rotate-90' : ''}`} src={assets.dropdown_icon} alt="" /></p>

          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFiltro ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>CATEGORIAS</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-800'>
              <p className='flex gap-2'><input className='w-3' value={"Men"} onChange={toggleCategoria} type="checkbox" /> HOMBRES </p>
              <p className='flex gap-2'><input className='w-3' value={"Women"} onChange={toggleCategoria} type="checkbox" /> MUJERES </p>
              <p className='flex gap-2'><input className='w-3' value={"Kids"} onChange={toggleCategoria} type="checkbox" /> NIÑOS </p>
            </div>
          </div>

          <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFiltro ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>TIPO</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'><input className='w-3' value={"Topwear"} onChange={toggleSubCategoria} type="checkbox" /> Topwear </p>
              <p className='flex gap-2'><input className='w-3' value={"Bottomwear"} onChange={toggleSubCategoria} type="checkbox" /> Bottomwear </p>
              <p className='flex gap-2'><input className='w-3' value={"Winterwear"} onChange={toggleSubCategoria} type="checkbox" /> Winterwear </p>
            </div>
          </div>
        </div>
      </section>

      <div class="main">
        <div class="row">
          <div class="column">

            <select onChange={(e) => setSortTipo(e.target.value)} className='border-2 border-gray-300 text-sm px-2' name="" id="">
              <option value="relavente">Sort by: Relavente</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {
              filtroProductos.map((item, index) => (
                <div style={{ padding: "20px", margin: "20px", border: "2px solid black" }} key={index}><ProductoItem id={item._id} img={item.img} name={item.nombre} price={item.precio} /></div>
              ))
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default MainHombres