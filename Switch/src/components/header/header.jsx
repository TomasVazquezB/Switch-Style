import React, { useState, useEffect } from 'react';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { BsMoon, BsSun } from 'react-icons/bs';

const Header = ({ toggleTheme }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
        localStorage.setItem('darkMode', isDarkMode.toString());
        const loggedIn = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedIn === 'true');
    }, [isDarkMode]);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        setIsDarkMode(savedMode === 'true');
    }, []);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const handleClick = (e) => {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => link.classList.remove('clicked'));
        e.target.classList.add('clicked');
        setTimeout(() => {
            e.target.classList.remove('clicked');
        }, 2000);
    };

    const handleProfileClick = () => setShowProfileMenu(!showProfileMenu);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const goToCart = () => navigate('/carrito');

    useEffect(() => {
        const body = document.body;
        const navbars = document.querySelectorAll('.navbar-top, .navbar-bottom');

        body.classList.remove('dark-mode', 'light-mode');
        navbars.forEach(nav => nav.classList.remove('navbar-light-mode'));

        if (isDarkMode) {
            body.classList.add('dark-mode');
        } else {
            body.classList.add('light-mode');
            navbars.forEach(nav => nav.classList.add('navbar-light-mode'));
        }

        localStorage.setItem('darkMode', isDarkMode.toString());
        const loggedIn = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedIn === 'true');
    }, [isDarkMode]);

    const getLinkClass = (isActive) =>
        `nav-link ${isDarkMode ? 'text-white' : 'text-dark'} ${isActive ? 'active-link' : ''}`;

    return (
        <>
            <div className={`offer-bar ${isDarkMode ? 'bg-ultra-dark' : 'bg-ultra-light'} text-center pt-4 pb-2`}>
                <br />
                <p className={isDarkMode ? 'text-dark' : 'text-white'}>¡Suscribite para obtener ofertas unicas y obten un 15% en tu primer compra!</p>
            </div>

            <Navbar expand="lg" className={`navbar-top ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
                <Container fluid>
                    <Navbar.Brand as={NavLink} to="/" onClick={() => navigate('/')}>
                        <img src="../src/assets/LOGO.png" width="90" height="50" className="d-inline-block align-top" alt="Logo" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="me-auto">
                            <div className="mode-switch">
                                <BsMoon className={`mode-icon ${isDarkMode ? 'active' : 'inactive'}`} />
                                <label className="switch">
                                    <input type="checkbox" onChange={toggleDarkMode} checked={isDarkMode} />
                                    <span className="slider" onClick={toggleTheme}></span>
                                </label>
                                <BsSun className={`mode-icon ${isDarkMode ? 'inactive' : 'active'}`} />
                            </div>
                        </Nav>

                        <div className="search-container">
                            <input className="search-input" type="search" placeholder="Buscar por producto, categoría o marca" aria-label="Search" />
                            <button className="search-btn">
                                <FaSearch />
                            </button>
                            <Nav.Link as={NavLink} to="/favoritos" className="icon-separator">
                                <FaHeart className={`navbar-icon ${isDarkMode ? 'text-white' : 'text-dark'}`} />
                            </Nav.Link>
                            <Nav.Link onClick={goToCart} className="icon-separator">
                                <FaShoppingCart className={`navbar-icon ${isDarkMode ? 'text-white' : 'text-dark'}`} />
                            </Nav.Link>
                        </div>

                        <Nav className="ms-auto">
                            {isLoggedIn ? (
                                <div className="profile-container">
                                    <FaUserCircle className="navbar-icon profile-icon" onClick={handleProfileClick} />
                                    {showProfileMenu && (
                                        <div className="profile-menu">
                                            <NavLink to="/perfil" className={({ isActive }) => getLinkClass(isActive)}>Mi Perfil</NavLink>
                                            <NavLink to="/pedidos" className={({ isActive }) => getLinkClass(isActive)}>Mis Pedidos</NavLink>
                                            <NavLink to="/favoritos" className={({ isActive }) => getLinkClass(isActive)}>Mis Favoritos</NavLink>
                                            <NavLink to="/FAQ" className={({ isActive }) => getLinkClass(isActive)}>Preguntas Frecuentes</NavLink>
                                            <button onClick={handleLogout}>Salir</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Nav.Link
                                        as={NavLink}
                                        to="/registro"
                                        onClick={handleClick}
                                        className={({ isActive }) => getLinkClass(isActive)}
                                    >
                                        Registro
                                    </Nav.Link>
                                    <Nav.Link
                                        as={NavLink}
                                        to="/login"
                                        onClick={handleClick}
                                        className={({ isActive }) => getLinkClass(isActive)}
                                    >
                                        Login
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Navbar expand="lg" className={`navbar-bottom ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
                <Container fluid>
                    <Nav className="me-auto" style={{ justifyContent: 'space-evenly', width: '100%' }}>
                        <div className="nav-dropdown">
                            <Nav.Link
                                as={NavLink}
                                to="/MainHombres"
                                className={({ isActive }) => getLinkClass(isActive)}
                            >
                                Hombres
                            </Nav.Link>
                            <div className="dropdown-menu">
                                <NavLink to="/ropa/hombres/remeras" className={({ isActive }) => getLinkClass(isActive)}>Remeras</NavLink>
                                <NavLink to="/ropa/hombres/pantalones" className={({ isActive }) => getLinkClass(isActive)}>Pantalones</NavLink>
                                <NavLink to="/ropa/hombres/camperas" className={({ isActive }) => getLinkClass(isActive)}>Camperas</NavLink>
                            </div>
                        </div>
                        <div className="nav-dropdown">
                            <Nav.Link
                                as={NavLink}
                                to="/MainMujeres"
                                className={({ isActive }) => getLinkClass(isActive)}
                            >
                                Mujeres
                            </Nav.Link>
                            <div className="dropdown-menu">
                                <NavLink to="/ropa/mujeres/remeras" className={({ isActive }) => getLinkClass(isActive)}>Remeras</NavLink>
                                <NavLink to="/ropa/mujeres/pantalones" className={({ isActive }) => getLinkClass(isActive)}>Pantalones</NavLink>
                                <NavLink to="/ropa/mujeres/camperas" className={({ isActive }) => getLinkClass(isActive)}>Camperas</NavLink>
                            </div>
                        </div>
                        <div className="nav-dropdown">
                            <Nav.Link
                                as={NavLink}
                                to="/MainKids"
                                className={({ isActive }) => getLinkClass(isActive)}
                            >
                                Chicos
                            </Nav.Link>
                            <div className="dropdown-menu">
                                <NavLink to="/ropa/kids/remeras" className={({ isActive }) => getLinkClass(isActive)}>Remeras</NavLink>
                                <NavLink to="/ropa/kids/pantalones" className={({ isActive }) => getLinkClass(isActive)}>Pantalones</NavLink>
                                <NavLink to="/ropa/kids/camperas" className={({ isActive }) => getLinkClass(isActive)}>Camperas</NavLink>
                            </div>
                        </div>
                        <div className="nav-dropdown">
                            <span className="nav-link">Accesorios</span>
                            <div className="dropdown-menu">
                                <NavLink to="/accesorios/cadenas" className={({ isActive }) => getLinkClass(isActive)}>Cadenas</NavLink>
                                <NavLink to="/accesorios/anillos" className={({ isActive }) => getLinkClass(isActive)}>Anillos</NavLink>
                                <NavLink to="/accesorios/brazaletes" className={({ isActive }) => getLinkClass(isActive)}>Brazaletes</NavLink>
                            </div>
                        </div>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;