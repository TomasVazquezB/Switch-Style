import React from 'react';
import './home.css';
import { FaSyncAlt, FaTruck, FaUndo } from 'react-icons/fa';

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
  'https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Última+1',
  'https://via.placeholder.com/400x300/33FF57/FFFFFF?text=Última+2',
  'https://via.placeholder.com/400x300/5733FF/FFFFFF?text=Última+3',
];

const Home = ({ darkMode }) => {
  return (
    <div className={`home-index ${darkMode ? 'dark' : 'light'}`}>
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: '50px' }}>
  <div className="carousel-indicators">
    {carouselImages.map((_, index) => (
      <button
        key={index}
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to={index}
        className={index === 0 ? 'active' : ''}
        aria-current={index === 0 ? 'true' : undefined}
        aria-label={`Slide ${index + 1}`}
      ></button>
    ))}
  </div>

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

  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>



      <h2 className="mas-buscado">Descubre los mas buscado</h2>
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
            <h3 className="service-title">Nuevos productos cada día</h3>
            <p className="service-description">Todos los días publicamos miles de artículos nuevos.</p>
          </div>

          <div className="service-item">
            <FaTruck size={40} />
            <h3 className="service-title">Entregas en 72 horas</h3>
            <p className="service-description">Tu pedido será entregado en el plazo máximo de 72 horas.</p>
          </div>

          <div className="service-item">
            <FaUndo size={40} />
            <h3 className="service-title">14 días de devolución</h3>
            <p className="service-description">Si no estás satisfecho con tu compra, tienes 14 días para devolver tu pedido.</p>
          </div>
        </div>
      </div>

      <div className="last-added-section">
        <h2 className='mas-buscado'>Últimas Prendas Añadidas</h2>
        <div id="lastAddedCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {lastAddedImages.map((image, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                <img src={image} className="d-block w-100" alt={`Última Prenda ${index + 1}`} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#lastAddedCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#lastAddedCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
