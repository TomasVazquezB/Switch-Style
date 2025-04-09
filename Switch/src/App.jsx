import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import { ContactoPage } from './pages/contacto/contacto';
import { FAQPage } from './pages/faq/faq';
import { QuienesSomosPage } from './pages/quienessomos/quienessomos';
import { RegistroPage } from './pages/registro/registro';
import { LoginPage } from './pages/login/login';
import  AdminPage  from './pages/admin/admin';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<ContactoPage />} />
                <Route path="/FAQ" element={<FAQPage />} />
                <Route path="/quienessomos" element={<QuienesSomosPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/registro" element={<RegistroPage />} />
            </Routes>
            <Footer />
            </Router>
    </>
  )
}

export default App;
