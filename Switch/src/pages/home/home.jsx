import React, { useState, useEffect } from 'react';
import { FaSyncAlt, FaTruck, FaUndo, FaApple, FaGooglePlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // <-- Importante, trae los estilos


const carouselImages = [
  'src/assets/CP 1.JPEG',
  'src/assets/CP 2.JPEG',

];

const cardImages = [
  'src/assets/DB 1.JPG',
  'src/assets/DB 2.JPG',
  'src/assets/DB 3.JPG',
  'src/assets/DB 4.JPG',
  'src/assets/DB 5.JPG',
  'src/assets/DB 6.JPG',
  'src/assets/DB 7.PNG',
];

const lastAddedImages = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
  'https://picsum.photos/400/300?random=5',
  'https://picsum.photos/400/300?random=6',
  '',
];

const cardsPerSlide = 3;

const Home = ({ darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => { handleNext(); }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => { setCurrentIndex((prevIndex) => prevIndex - cardsPerSlide < 0 ? lastAddedImages.length - cardsPerSlide : prevIndex - cardsPerSlide); };

  const handleNext = () => { setCurrentIndex((prevIndex) => prevIndex + cardsPerSlide >= lastAddedImages.length ? 0 : prevIndex + cardsPerSlide); };

  return (
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
            dynamicHeight={false}
          >
            {carouselImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
                <div className="hero-text-zara">
                  <h1 className="title">Últimas novedades</h1>
                  <p className="description">Descubre las nuevas tendencias del momento con súper ofertas de lanzamiento</p>
                  <button className="btn-discover">Descubre lo nuevo</button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

      </div>


      <div>
        <h2 className="mas-buscado">Lo más buscado</h2>
        <div className="card-container">{cardImages.map((image, index) => (
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
            <br />
            <h3 className="service-title">Nuevos productos cada día</h3>
            <p className="service-description">Todos los días publicamos miles de artículos nuevos</p>
          </div>
          <div className="service-item">
            <FaTruck size={40} />
            <br />
            <br />
            <h3 className="service-title">Entregas en 72 horas</h3>
            <p className="service-description">Tu pedido será entregado un plazo máximo de 72 horas</p>
          </div>
          <div className="service-item">
            <FaUndo size={40} />
            <br />
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
          <div className="carousel-cards-track" style={{ transform: `translateX(-${(currentIndex / cardsPerSlide) * 100}%)` }}>
            {lastAddedImages.map((img, idx) => (
              <div className="carousel-card-home" key={idx}>
                <img src={img} alt={`Prenda ${idx + 1}`} />
              </div>
            ))}
          </div>
          <button className="carousel-cards-btn" onClick={handleNext}><FaChevronRight /></button>
        </div>
      </div>

      <div className="download-section">
        <hr />
        <p className="download-text">Descarga la aplicación y únete a la experiencia Switch Style</p>
        <div className="download-icons">
          <div className="store-icon"><FaApple size={40} /><p>App Store</p></div>
          <div className="store-icon"><FaGooglePlay size={40} /><p>Play Store</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;