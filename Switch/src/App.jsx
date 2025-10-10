import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import { FAQPage } from './pages/faq/faq';
import { QuienesSomosPage } from './pages/quienessomos/quienessomos';
import { RegistroPage } from './pages/registro/registro';
import { LoginPage } from './pages/login/login';
import CarritoPage from './pages/carrito/carrito.jsx';
import MainHombresPage from './pages/Hombre/MainHombres.jsx';
import MainMujeresPage from './pages/Mujer/MainMujeres';
import MainKidsPage from './pages/Kids/MainKids.jsx';
import MainAccesorios from './pages/Accesorios/MainAccesorios.jsx';
import Productos from './pages/Productos/Productos.jsx';
import Favoritos from './pages/favoritos/favoritos.jsx';
import ErrorBoundary from './components/Error/ErrorBoundary';
import Busqueda from './pages/busqueda/Busqueda.jsx';
import { ToastContainer } from 'react-toastify';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import 'react-toastify/dist/ReactToastify.css';
import '/index.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <PayPalScriptProvider options={{ clientId: "AbSH4YtXgr7HDRqfrLVMI8GJRF_iOK10cGwbs_NiwJN96bDp6GcZsOERyV4T29kvRE1o2D--KJAXFJE3" }}>
      <div className="app-wrapper">
        <Header toggleTheme={toggleTheme} />
        <main className="app-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/buscar" element={<Busqueda />} />
              <Route path="/" element={<PageTitle title="Switch Style"><Home darkMode={darkMode} /></PageTitle>} />
              <Route path="/FAQ" element={<PageTitle title="Preguntas Frecuentes"><FAQPage /></PageTitle>} />
              <Route path="/quienessomos" element={<PageTitle title="Quiénes Somos"><QuienesSomosPage /></PageTitle>} />
              <Route path="/login" element={<PageTitle title="Login"><LoginPage /></PageTitle>} />
              <Route path="/registro" element={<PageTitle title="Registro"><RegistroPage /></PageTitle>} />
              <Route path="/carrito" element={<PageTitle title="Carrito"><CarritoPage /></PageTitle>} />
              <Route path="/MainHombres" element={<PageTitle title="Hombres"><MainHombresPage /></PageTitle>} />
              <Route path="/MainMujeres" element={<PageTitle title="Mujeres"><MainMujeresPage /></PageTitle>} />
              <Route path="/MainKids" element={<PageTitle title="Chicos"><MainKidsPage /></PageTitle>} />
              <Route path="/accesorios" element={<PageTitle title="Accesorios"><MainAccesorios /></PageTitle>} />
              <Route path="/producto/:tipo/:productoId" element={<Productos />} />
              <Route path="/favoritos" element={<PageTitle title="Favoritos"><Favoritos /></PageTitle>} />
            </Routes>
          </ErrorBoundary>
        </main>
        <ToastContainer position="top-right" />
        <Footer />
      </div>
    </PayPalScriptProvider>
  );
}

function PageTitle({ title, children }) {
  const location = useLocation();
  useEffect(() => { document.title = title; }, [location, title]);
  return <>{children}</>;
}

export default App;