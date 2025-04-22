import React from 'react';
import './home.css';
import { FaSyncAlt, FaTruck, FaUndo, FaApple, FaGooglePlay } from 'react-icons/fa';
import { Carousel } from 'react-bootstrap';

const carouselImages = [
  'https://via.placeholder.com/800x300/FF0000/FFFFFF?text=Imagen+1',
  'https://via.placeholder.com/800x300/00FF00/FFFFFF?text=Imagen+2',
  'https://via.placeholder.com/800x300/0000FF/FFFFFF?text=Imagen+3',
];

const cardImages = [
  'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Card+1',
  'https://via.placeholder.com/300x200/00FF00/FFFFFF?text=Card+2',
  'https://via.placeholder.com/300x200/0000FF/FFFFFF?text=Card+3',
];

const lastAddedImages = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
  'https://picsum.photos/400/300?random=5',
  'https://picsum.photos/400/300?random=6',
];

const Home = ({ darkMode }) => {
  return (
    <div className={`home-index ${darkMode ? 'dark' : 'light'}`}>
      <div id="varkalaCarousel" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: '50px' }}>


        <div className="carousel-inner">
          {carouselImages.map((image, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <div className="hero-carousel-zara">
                <div className="hero-text-zara">
                  <p className="subtitle">OUR ALL-TIME FAVOURITES</p>
                  <h1 className="title">Blouses & Tops</h1>
                  <p className="description">
                    Discover our best-loved pieces – timeless styles you'll want to wear again and again.
                  </p>
                  <button className="btn-discover">DISCOVER MORE</button>
                </div>
                <div className="hero-image-zara">
                  <img src={image} alt={`Slide ${index + 1}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#varkalaCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#varkalaCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <h2 className="mas-buscado">Descubre los más buscado</h2>
      <br />
      <br />
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

      <div className="service-section">
        <div className="service-box">
          <div className="service-item">
            <FaSyncAlt size={40} />
            <br />
            <br />
            <h3 className="service-title">Nuevos productos cada día</h3>
            <p className="service-description">Todos los días publicamos miles de artículos nuevos.</p>
          </div>
          <div className="service-item">
            <FaTruck size={40} />
            <br />
            <br />
            <h3 className="service-title">Entregas en 72 horas</h3>
            <p className="service-description">Tu pedido será entregado en el plazo máximo de 72 horas.</p>
          </div>
          <div className="service-item">
            <FaUndo size={40} />
            <br />
            <br />
            <h3 className="service-title">14 días de devolución</h3>
            <p className="service-description">Si no estás satisfecho con tu compra, tienes 14 días para devolver tu pedido.</p>
          </div>
        </div>
      </div>

      <div className="last-added-section">
        <h2 className="mas-buscado">Últimas Prendas Añadidas</h2>
        <Carousel id="custom-last-added-carousel" indicators={false} interval={null}>
          {[0, 3].map((startIndex) => (
            <Carousel.Item key={startIndex}>
              <div className="cards-carousel-fullwidth">
                {lastAddedImages.slice(startIndex, startIndex + 3).map((img, idx) => (
                  <div className="card-home" key={idx}>
                    <img src={img} className="card-img-top" alt={`Última Prenda ${startIndex + idx + 1}`} />
                    <div className="card-body text-center">
                      <button className="btn-primary">Ver más</button>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

      </div>

      <div className="download-section">
        <hr/>
        <p className="download-text">Descarga la aplicación y únete a la experiencia Switch Style</p>
        <div className="download-icons">
          <div className="store-icon">
            <FaApple size={50} />
            <p>App Store</p>
          </div>
          <div className="store-icon">
            <FaGooglePlay size={50} />
            <p>Play Store</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;