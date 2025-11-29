// src/pages/Home/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { FaChevronLeft, FaChevronRight, FaSyncAlt, FaTruck, FaUndo } from 'react-icons/fa';
import './home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { DataContext } from '../../context/DataContext';
import ErrorBoundary from '../../components/Error/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';
import DB1 from '../../assets/p_img27.png';
import DB2 from '../../assets/p_img46.png';
import DB3 from '../../assets/p_img44.png';
import DB4 from '../../assets/p_img23.png';
import DB5 from '../../assets/p_img26.png';
import DB6 from '../../assets/p_img25.png';
import DB7 from '../../assets/p_img32.png';
import img1 from '../../assets/p_img1.png';
import img2 from '../../assets/p_img2.png';
import img3 from '../../assets/p_img3.png';
import img4 from '../../assets/p_img4.png';
import img5 from '../../assets/p_img5.png';
import img6 from '../../assets/p_img6.png';
import img7 from '../../assets/p_img7.png';
import img8 from '../../assets/p_img8.png';
import img9 from '../../assets/p_img9.png';
import img10 from '../../assets/p_img10.png';
import img11 from '../../assets/p_img11.png';
import img12 from '../../assets/p_img12.png';
import img13 from '../../assets/p_img13.png';
import img14 from '../../assets/p_img14.png';

const carouselImages = [banner1, banner2, banner3];
const cardImages = [DB1, DB2, DB3, DB4, DB5, DB6, DB7];
const lastAddedImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14];
const cardsPerSlide = 7;

const Home = ({ darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { producto } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + cardsPerSlide) % lastAddedImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tutorialShown = localStorage.getItem('tutorialShown');
    if (!tutorialShown) {
      setShowModal(true);
    }
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - cardsPerSlide + lastAddedImages.length) % lastAddedImages.length);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + cardsPerSlide) % lastAddedImages.length);
  };

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem('tutorialShown', 'true');
  };

  const [showImagePopup, setShowImagePopup] = useState(false);

  /* 
// 🔒 Versión original que solo mostraba el popup UNA VEZ
useEffect(() => {
  const popupShown = localStorage.getItem("homeImagePopupShown");  // revisa si ya se mostró
  if (!popupShown) {
    setShowImagePopup(true); // si no se mostró nunca → mostrar popup
  }
}, []);
*/

  //
  // 👇 Versión temporal para desarrollo
  // 🔄 Muestra el popup SIEMPRE (cada F5)
  // ------------------------------
  useEffect(() => {
    setShowImagePopup(true);  // siempre abrir el popup al cargar Home
  }, []);

  // ---------------------------------------------
  // ❌ Cierra el popup
  // ❗ No guarda nada en localStorage (para que siga apareciendo mientras editás)
  // ---------------------------------------------
  const closeImagePopup = () => {
    setShowImagePopup(false);

    /* 
    // 🟢 Cuando termines de editar el popup, descomentá esta línea.
    // Hará que el popup se muestre solo una vez por usuario.
    localStorage.setItem("homeImagePopupShown", "true");
    */
  };




  return (
    <ErrorBoundary>
      <div className={`home-index ${darkMode ? 'dark' : 'light'}`}>

        {showImagePopup && (
          <div className="popup-backdrop">
            <div className="popup-box">
              <img
                src="https://res.cloudinary.com/dms4m8cnu/image/upload/v1764452292/POPUP_aqxs6j.png"
                alt="Promo"
                className="popup-img"
              />

              <button className="popup-close" onClick={closeImagePopup}>✖</button>
            </div>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <div id="varkalaCarousel" className="carousel slide varkala-carousel" data-bs-ride="carousel" data-bs-interval="5000">
          <div className="carousel-wrapper">
            <Carousel autoPlay infiniteLoop interval={5000} showThumbs={false} showStatus={false} showIndicators swipeable emulateTouch stopOnHover dynamicHeight={false}
              renderArrowPrev={(onClickHandler, hasPrev, label) => hasPrev && (
                <button type="button" onClick={onClickHandler} title={label} className="custom-carousel-arrow left">
                  <FaChevronLeft />
                </button>
              )}
              renderArrowNext={(onClickHandler, hasNext, label) => hasNext && (
                <button type="button" onClick={onClickHandler} title={label} className="custom-carousel-arrow right">
                  <FaChevronRight />
                </button>
              )}
            >
              <div>
                <img src={banner1} alt="Slide 1" />
                <div className="hero-text-zara">
                  <h1 className="title">Últimas novedades</h1>
                  <p className="description">Descubre las nuevas tendencias del momento con súper ofertas de lanzamiento</p>
                  <button className="btn-discover" onClick={() => navigate('/MainMujeres')}>Descubre lo nuevo</button>
                </div>
              </div>
              <div>
                <img src={banner2} alt="Slide 2" />
                <div className="hero-text-zara">
                  <h1 className="title">¿Tenés dudas?</h1>
                  <p className="description">Visitá nuestra sección de Preguntas Frecuentes y resolvé tus inquietudes al instante</p>
                  <button className="btn-discover" onClick={() => navigate('/faq')}>Ver Preguntas Frecuentes</button>
                </div>
              </div>
              <div>
                <img src={banner3} alt="Slide 3" />
                <div className="hero-text-zara">
                  <h1 className="title">¡Únete a la Comunidad Switch Style!</h1>
                  <p className="description">Registrate y obtené un descuento especial por formar parte de nuestra comunidad</p>
                  <button className="btn-discover" onClick={() => navigate('/registro')}>Registrarme</button>
                </div>
              </div>
            </Carousel>
          </div>
        </div>
        <div>
          <h2 className="mas-buscado">Lo más buscado</h2>
          <br />
          <div className="card-container">
            {cardImages.map((image, index) => (
              <div className="card-home" key={index}>
                <img src={image} className="card-img-top" alt={`Card ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="service-section">
          <div className="service-box">
            <div className="service-item">
              <FaSyncAlt size={45} />
              <br />
              <h3 className="service-title">Nuevos productos cada día</h3>
              <p className="service-description">Todos los días publicamos miles de artículos nuevos</p>
            </div>
            <div className="service-item">
              <FaTruck size={45} />
              <br />
              <h3 className="service-title">Entregas en 72 horas</h3>
              <p className="service-description">Tu pedido será entregado en un máximo de 72 horas</p>
            </div>
            <div className="service-item">
              <FaUndo size={45} />
              <br />
              <h3 className="service-title">14 días de devolución</h3>
              <p className="service-description">Si no estás satisfecho con tu compra, tenés 14 días para devolverla</p>
            </div>
          </div>
        </div>

        <div className="last-added-section">
          <h2 className="ultimas-prendas">¡Últimas Novedades!</h2>
          <div className="carousel-cards-wrapper" style={{ '--cards-per-slide': cardsPerSlide }}>
            <button className="carousel-cards-btn" onClick={handlePrev} aria-label="Anterior"><FaChevronLeft /></button>

            <div className="carousel-cards-track" style={{ width: `${(lastAddedImages.length / cardsPerSlide) * 100}%`, transform: `translateX(-${currentIndex * (100 / cardsPerSlide)}%)` }}>
              {lastAddedImages.map((img, idx) => (
                <div className="carousel-card-home" key={idx} style={{ flex: `0 0 calc(100% / ${cardsPerSlide})` }}>
                  <img src={img} alt={`Prenda ${idx + 1}`} />
                </div>
              ))}
            </div>

            <button className="carousel-cards-btn" onClick={handleNext} aria-label="Siguiente"><FaChevronRight /></button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Home;