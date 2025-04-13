import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/FAQ" element={<FAQPage />} />
          <Route path="/quienessomos" element={<QuienesSomosPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
