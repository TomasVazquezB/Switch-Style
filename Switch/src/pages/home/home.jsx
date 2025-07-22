import React, { useState, useEffect, useContext } from 'react';
import { FaChevronLeft, FaChevronRight, FaApple, FaGooglePlay, FaSyncAlt, FaTruck, FaUndo } from 'react-icons/fa';
import './home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { DataContext } from '../../context/DataContext';
import ErrorBoundary from '../../components/Error/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';

import DB1 from '../../assets/DB1.JPG';
import DB2 from '../../assets/DB2.JPG';
import DB3 from '../../assets/DB3.JPG';
import DB4 from '../../assets/DB4.JPG';
import DB5 from '../../assets/DB5.JPG';
import DB6 from '../../assets/DB6.JPG';
import DB7 from '../../assets/DB7.PNG';

const carouselImages = [banner1, banner2, banner3];
const cardImages = [DB1, DB2, DB3, DB4, DB5, DB6, DB7];
const lastAddedImages = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
  'https://picsum.photos/400/300?random=5',
  'https://picsum.photos/400/300?random=6',
  'https://picsum.photos/400/300?random=7',
  'https://picsum.photos/400/300?random=8',
  'https://picsum.photos/400/300?random=9',
  'https://picsum.photos/400/300?random=10',
  'https://picsum.photos/400/300?random=11',
  'https://picsum.photos/400/300?random=12',
  'https://picsum.photos/400/300?random=13',
  'https://picsum.photos/400/300?random=14',
];
const cardsPerSlide = 7;

const Home = ({ darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { producto } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/prueba')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  const crearProductoDePrueba = () => {
    fetch('http://127.0.0.1:8000/api/producto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Nombre: 'Campera Switch',
        Descripción: 'Campera estilo urbano',
        Precio: 299.99,
        Tipo: 'Casual',
        Imagen: 'campera.jpg',
        ID_Tienda: 1
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Producto insertado correctamente:', data);
        alert('✅ Producto creado correctamente');
      })
      .catch(err => {
        console.error('❌ Error al insertar producto:', err);
        alert('⚠️ Error al crear producto. Ver consola.');
      });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - cardsPerSlide + lastAddedImages.length) % lastAddedImages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + cardsPerSlide) % lastAddedImages.length);
  };

  return (
    <ErrorBoundary>
      <div className={`home-index ${darkMode ? 'dark' : 'light'}`}>
        <div id="varkalaCarousel" className="carousel slide varkala-carousel" data-bs-ride="carousel" data-bs-interval="5000">
          <div className="carousel-wrapper">
            <Carousel
              autoPlay
              infiniteLoop
              interval={5000}
              showThumbs={false}
              showStatus={false}
              showIndicators={true}
              swipeable
              emulateTouch
              stopOnHover
              dynamicHeight={false}>
              {carouselImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Slide ${index + 1}`} />
                  <div className="hero-text-zara">
                    <h1 className="title">Últimas novedades</h1>
                    <p className="description">Descubre las nuevas tendencias del momento con súper ofertas de lanzamiento</p>
                    <button className="btn-discover" onClick={() => navigate('/MainMujeres')}>
                      Descubre lo nuevo
                    </button>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        <div>
          <h2 className="mas-buscado">Lo más buscado</h2>
          <div className="card-container">
            {cardImages.map((image, index) => (
              <div className="card-home" key={index}>
                <img src={image} className="card-img-top" alt={`Card ${index + 1}`} />
                <div className="card-body">
                  <button className="btn-primary">Ver más</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="service-section">
          <div className="service-box">
            <div className="service-item">
              <FaSyncAlt size={40} />
              <br />
              <h3 className="service-title">Nuevos productos cada día</h3>
              <p className="service-description">Todos los días publicamos miles de artículos nuevos</p>
            </div>
            <div className="service-item">
              <FaTruck size={40} />
              <br />
              <h3 className="service-title">Entregas en 72 horas</h3>
              <p className="service-description">Tu pedido será entregado un plazo máximo de 72 horas</p>
            </div>
            <div className="service-item">
              <FaUndo size={40} />
              <br />
              <h3 className="service-title">14 días de devolución</h3>
              <p className="service-description">Si no estás satisfecho con tu compra, tienes 14 días para devolver tu pedido</p>
            </div>
          </div>
        </div>

        <div className="last-added-section">
          <h2 className="mas-buscado">Últimas Prendas Añadidas</h2>
          <div className="carousel-cards-wrapper">
            <button className="carousel-cards-btn" onClick={handlePrev}><FaChevronLeft /></button>
            <div className="carousel-cards-track" style={{ transform: `translateX(-${(currentIndex / lastAddedImages.length) * 100}%)` }}>
              {lastAddedImages.map((img, idx) => (
                <div className="carousel-card-home" key={idx} style={{ flex: `0 0 calc(100% / ${cardsPerSlide})` }}>
                  <img src={img} alt={`Prenda ${idx + 1}`} />
                </div>
              ))}
            </div>
            <button className="carousel-cards-btn" onClick={handleNext}><FaChevronRight /></button>
          </div>
        </div>

        {producto && producto.length > 0 && (
          <div className="productos-section">
            <h2>Productos Recientes</h2>
            <div className="productos-container">
              {producto.map((item) => (
                <div className="producto-card" key={item.id}>
                  <img src={item.imagen} alt={item.nombre} className="producto-img" />
                  <h3>{item.nombre}</h3>
                  <p>{item.descripcion}</p>
                  <p>${item.precio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="download-section">
          <hr className="black-line" />
          <div className="download-row">
            <p className="download-text">Descarga la aplicación y únete a la experiencia Switch Style</p>
            <div className="download-icons">
              <a className="store-icon" href="https://apps.apple.com/app/id000000000" target="_blank" rel="noopener noreferrer">
                <FaApple size={40} />
                <p>App Store</p>
              </a>
              <a className="store-icon" href="https://play.google.com/store/apps/details?id=com.switchstyle.app" target="_blank" rel="noopener noreferrer">
                <FaGooglePlay size={40} />
                <p>Play Store</p>
              </a>

            </div>
          </div>
          <br />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Home;