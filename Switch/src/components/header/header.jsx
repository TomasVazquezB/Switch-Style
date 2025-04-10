import React, { useState, useEffect } from 'react';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { BsMoon, BsSun } from 'react-icons/bs';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Estado para controlar si el usuario está logueado
    const [showProfileMenu, setShowProfileMenu] = useState(false); // Controlar si el menú de perfil está visible
    const navigate = useNavigate();

    // Verificar el estado del modo oscuro al cargar la página (por defecto oscuro)
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setIsDarkMode(true); // Si el usuario guardó que quiere modo oscuro, aplicar
        } else {
            setIsDarkMode(false); // Si no, aplicar modo claro por defecto
        }

        // Verificar si el usuario está logueado (esto es solo un ejemplo, ajusta según tu autenticación)
        const loggedIn = localStorage.getItem('isLoggedIn');  // Por ejemplo, si hay un token
        setIsLoggedIn(loggedIn === 'true');
    }, []);

    // Cambiar entre modo oscuro y claro
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', newMode.toString());  // Guardar la preferencia en el localStorage
    };

    // Manejar el clic de los enlaces
    const handleClick = (e) => {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => link.classList.remove('clicked'));
        e.target.classList.add('clicked');
        setTimeout(() => {
            e.target.classList.remove('clicked');
        }, 2000);
    };

    // Función para manejar el clic en el ícono de perfil
    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu); // Alternar visibilidad del menú de perfil
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        // Eliminar la información de sesión (ajusta según cómo gestionas la sesión)
        localStorage.removeItem('isLoggedIn');  // Esto depende de cómo manejes la autenticación
        setIsLoggedIn(false);
        navigate('/login');  // Redirigir al usuario al login o inicio
    };

    // Función para redirigir al carrito
    const goToCart = () => {
        navigate('/carrito');  // Redirige a la página del carrito
    };

    // Para que la navbar se cargue con fondo negro al inicio (independientemente del modo)
    useEffect(() => {
        document.body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
    }, [isDarkMode]);

    return (
        <>
            {/* Barra de Anuncio */}
            <div className="offer-bar bg-info text-white text-center py-2">
                <p>¡No te pierdas nuestras ofertas especiales de esta semana!</p>
            </div>

            {/* Navbar Principal */}
            <Navbar expand="lg" className={`navbar-top ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
                <Container fluid style={{ maxWidth: "100%" }}>
                    <Navbar.Brand as={NavLink} to="/" onClick={() => navigate('/')}>
                        <img src="" width="30" height="30" className="d-inline-block align-top" alt="" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarNav" />

                    <Navbar.Collapse id="navbarNav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/faq" onClick={handleClick}>FAQ</Nav.Link>
                            <Nav.Link as={NavLink} to="/quienessomos" onClick={handleClick}>Quienes Somos</Nav.Link>
                            
                            {/* Interruptor de Modo Claro/Oscuro con Íconos */}
                            <div className="mode-switch">
                                <BsSun className={`mode-icon ${isDarkMode ? 'inactive' : 'active'}`} />
                                <label className="switch">
                                    <input type="checkbox" onChange={toggleDarkMode} checked={isDarkMode} />
                                    <span className="slider"></span>
                                </label>
                                <BsMoon className={`mode-icon ${isDarkMode ? 'active' : 'inactive'}`} />
                            </div>
                        </Nav>

                        {/* Buscador y Iconos */}
                        <div className="search-container">
                            <input className="search-input" type="search" placeholder="Buscar por producto, categoría o marca" aria-label="Search" />
                            <button className="search-btn">
                                <FaSearch />
                            </button>

                            <Nav.Link as={NavLink} to="/favoritos">
                                <FaHeart className={`navbar-icon ${isDarkMode ? 'text-white' : 'text-dark'}`} />
                            </Nav.Link>
                            {/* Aquí usamos la función goToCart para redirigir al carrito */}
                            <Nav.Link onClick={goToCart}>
                                <FaShoppingCart className={`navbar-icon ${isDarkMode ? 'text-white' : 'text-dark'}`} />
                            </Nav.Link>
                        </div>

                        {/* Si el usuario está logueado, mostrar el icono de perfil */}
                        <Nav className="ms-auto">
                            {isLoggedIn ? (
                                <div className="profile-container">
                                    <FaUserCircle 
                                        className="navbar-icon profile-icon" 
                                        onClick={handleProfileClick} 
                                    />
                                    {showProfileMenu && (
                                        <div className="profile-menu">
                                            <NavLink to="/perfil">Mi Perfil</NavLink>
                                            <NavLink to="/pedidos">Mis Pedidos</NavLink>
                                            {/* Aquí agregamos el enlace de "Favoritos" dentro del menú */}
                                            <NavLink to="/favoritos">Mis Favoritos</NavLink>
                                            <button onClick={handleLogout}>Salir</button>  {/* Botón para salir */}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to="/registro" activeClassName="active-link" onClick={handleClick}>Registro</Nav.Link>
                                    <Nav.Link as={NavLink} to="/login" activeClassName="active-link" onClick={handleClick}>Login</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Barra de categorías debajo de la principal */}
            <Navbar expand="lg" className={`bg-${isDarkMode ? 'dark' : 'light'}`}>
                <Container fluid>
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/ropa/hombres" onClick={handleClick}>Hombres</Nav.Link>
                        <Nav.Link as={NavLink} to="/ropa/mujeres" onClick={handleClick}>Mujeres</Nav.Link>
                        <Nav.Link as={NavLink} to="/ropa/ninos" onClick={handleClick}>Niños</Nav.Link>
                        <Nav.Link as={NavLink} to="/ropa/accesorios" onClick={handleClick}>Accesorios</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
