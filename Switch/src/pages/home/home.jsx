import React from 'react';
import './home.css';
import { FaApple, FaGooglePlay, FaSyncAlt, FaTruck, FaUndo } from 'react-icons/fa';

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

const Home = ({ darkMode }) => {
  return (
    <div className={`home-index ${darkMode ? 'dark' : 'light'}`}>
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: '50px' }}>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          {carouselImages.map((image, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <img src={image} className="d-block w-100" alt={`Slide ${index + 1}`} />
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

      <h2 className="mas-buscado">Productos Destacados</h2>
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
            <br/>
            <FaSyncAlt size={40} />
            <br/>
            <br/>
            <h3 className="service-title">Nuevos productos cada día</h3>
            <p className="service-description">Todos los días publicamos miles de artículos nuevos.</p>
          </div>

          <div className="service-item">
            <br/>
            <FaTruck size={40} />
            <br/>
            <br/>
            <h3 className="service-title">Entregas en 72 horas</h3>
            <p className="service-description">Tu pedido será entregado en el plazo máximo de 72 horas.</p>
          </div>

          <div className="service-item">
            <br/>
            <FaUndo size={40} />
            <br/>
            <br/>
            <h3 className="service-title">14 días de devolución</h3>
            <p className="service-description">Si no estás satisfecho con tu compra, tienes 14 días para devolver tu pedido.</p>
          </div>
        </div>
      </div>

      <div className="download-section" style={{ marginTop: '200px' }}>
        <hr />
        <p className="download-text">Descarga la aplicación y únete a la experiencia Switch Style</p>
        <div className="download-icons" style={{ justifyContent: 'flex-end' }}>
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