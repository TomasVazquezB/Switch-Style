import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import { FAQPage } from './pages/faq/faq';
import { QuienesSomosPage } from './pages/quienessomos/quienessomos';
import { RegistroPage } from './pages/registro/registro';
import { LoginPage } from './pages/login/login';
import CarritoPage from './pages/carrito/carrito.jsx';
import MainHombresPage from './pages/Catalog/MainHombres.jsx';
import MainMujeresPage from './pages/Catalog/MainMujeres.jsx';
import MainKidsPage from './pages/Catalog/MainKids.jsx';
import MainAccesorios from './pages/Catalog/MainAccesorios.jsx';
import Productos from './pages/Productos/Productos.jsx';
import Favoritos from './pages/favoritos/favoritos.jsx';
import ErrorBoundary from './components/Error/ErrorBoundary';
import Pedidos from './pages/pedidos/pedidos.jsx';
import ConfPago from './pages/confpago/confpago.jsx';
import Pago from './pages/pago/pago.jsx';
import { ToastContainer } from 'react-toastify';
import Busqueda from './pages/busqueda/Busqueda.jsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
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

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          'AbSH4YtXgr7HDRqfrLVMI8GJRF_iOK10cGwbs_NiwJN96bDp6GcZsOERyV4T29kvRE1o2D--KJAXFJE3',
      }}
    >
      <div className="app-wrapper">
        <Header toggleTheme={toggleTheme} darkMode={darkMode} />

        <main className="app-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/buscar" element={<Busqueda />} />

              <Route
                path="/"
                element={
                  <PageTitle title="Switch Style">
                    <Home darkMode={darkMode} />
                  </PageTitle>
                }
              />

              <Route
                path="/FAQ"
                element={
                  <PageTitle title="Preguntas Frecuentes">
                    <FAQPage />
                  </PageTitle>
                }
              />

              <Route
                path="/quienessomos"
                element={
                  <PageTitle title="Quiénes Somos">
                    <QuienesSomosPage />
                  </PageTitle>
                }
              />

              <Route
                path="/login"
                element={
                  <PageTitle title="Login">
                    <LoginPage />
                  </PageTitle>
                }
              />

              <Route
                path="/registro"
                element={
                  <PageTitle title="Registro">
                    <RegistroPage />
                  </PageTitle>
                }
              />

              <Route
                path="/carrito"
                element={
                  <PageTitle title="Carrito">
                    <CarritoPage />
                  </PageTitle>
                }
              />

              <Route
                path="/MainHombres"
                element={
                  <PageTitle title="Hombres">
                    <MainHombresPage darkMode={darkMode} />
                  </PageTitle>
                }
              />

              <Route
                path="/MainMujeres"
                element={
                  <PageTitle title="Mujeres">
                    <MainMujeresPage darkMode={darkMode} />
                  </PageTitle>
                }
              />

              <Route
                path="/MainKids"
                element={
                  <PageTitle title="Chicos">
                    <MainKidsPage darkMode={darkMode} />
                  </PageTitle>
                }
              />

              <Route
                path="/accesorios"
                element={
                  <PageTitle title="Accesorios">
                    <MainAccesorios darkMode={darkMode} />
                  </PageTitle>
                }
              />

              <Route
                path="/producto/:tipo/:productoId"
                element={<Productos darkMode={darkMode} />}
              />

              <Route
                path="/favoritos"
                element={
                  <PageTitle title="Favoritos">
                    <Favoritos />
                  </PageTitle>
                }
              />

              <Route
                path="/pedidos"
                element={
                  <PageTitle title="Mis Pedidos">
                    <Pedidos />
                  </PageTitle>
                }
              />

              <Route
                path="/confpago"
                element={
                  <PageTitle title="Confirmar Pago">
                    <ConfPago />
                  </PageTitle>
                }
              />

              <Route
                path="/pago"
                element={
                  <PageTitle title="Pago">
                    <Pago />
                  </PageTitle>
                }
              />
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
  useEffect(() => {
    document.title = title;
  }, [location, title]);
  return <>{children}</>;
}

export default App;
