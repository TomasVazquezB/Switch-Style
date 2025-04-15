import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import { FAQPage } from './pages/faq/faq';
import { QuienesSomosPage } from './pages/quienessomos/quienessomos';
import { RegistroPage } from './pages/registro/registro';
import { LoginPage } from './pages/login/login';
import AdminPage from './pages/admin/admin';
import CarritoPage from './pages/carrito/carrito';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <div>
      <Router>
        <Header toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<PageTitle title="Switch Style"><Home darkMode={darkMode} /></PageTitle>} />
          <Route path="/FAQ" element={<PageTitle title="Preguntas Frecuentes"><FAQPage /></PageTitle>} />
          <Route path="/quienessomos" element={<PageTitle title="Quiénes Somos"><QuienesSomosPage /></PageTitle>} />
          <Route path="/login" element={<PageTitle title="Login"><LoginPage /></PageTitle>} />
          <Route path="/admin" element={<PageTitle title="Admin"><AdminPage /></PageTitle>} />
          <Route path="/registro" element={<PageTitle title="Registro"><RegistroPage /></PageTitle>} />
          <Route path="/carrito" element={<PageTitle title="Carrito"><CarritoPage /></PageTitle>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

function PageTitle({ title, children }) {const location = useLocation();

useEffect(() => {document.title = title;}, [location, title]);

  return <>{children}</>;
}

export default App;