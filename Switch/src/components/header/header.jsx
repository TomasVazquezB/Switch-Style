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
    const [isLoggedIn, setIsLoggedIn] = useState(false);  
    const [showProfileMenu, setShowProfileMenu] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setIsDarkMode(true); 
        } else {
            setIsDarkMode(false); 
        }

        const loggedIn = localStorage.getItem('isLoggedIn');  
        setIsLoggedIn(loggedIn === 'true');
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', newMode.toString());  
    };

    const handleClick = (e) => {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => link.classList.remove('clicked'));
        e.target.classList.add('clicked');
        setTimeout(() => {
            e.target.classList.remove('clicked');
        }, 2000);
    };

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu); 
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');  
        setIsLoggedIn(false);
        navigate('/login');  
    };

    
    const goToCart = () => {
        navigate('/carrito');  
    };

    useEffect(() => {
        document.body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
    }, [isDarkMode]);

    return (
        <>
            <div className="offer-bar bg-info text-white text-center py-2">
                <p>¡Suscribite para obtener ofertas unicas y obten un 15% en tu primer compra!</p>
            </div>

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
                            
                            <div className="mode-switch">
                                <BsSun className={`mode-icon ${isDarkMode ? 'inactive' : 'active'}`} />
                                <label className="switch">
                                    <input type="checkbox" onChange={toggleDarkMode} checked={isDarkMode} />
                                    <span className="slider"></span>
                                </label>
                                <BsMoon className={`mode-icon ${isDarkMode ? 'active' : 'inactive'}`} />
                            </div>
                        </Nav>

                        <div className="search-container">
                            <input className="search-input" type="search" placeholder="Buscar por producto, categoría o marca" aria-label="Search" />
                            <button className="search-btn">
                                <FaSearch />
                            </button>
                            <Nav.Link as={NavLink} to="/favoritos">
                                <FaHeart className={`navbar-icon ${isDarkMode ? 'text-white' : 'text-dark'}`} />
                            </Nav.Link>
                            <Nav.Link onClick={goToCart}>
                                <FaShoppingCart className={`navbar-icon ${isDarkMode ? 'text-white' : 'text-dark'}`} />
                            </Nav.Link>
                        </div>

                        <Nav className="ms-auto">
                            {isLoggedIn ? (
                                <div className="profile-container">
                                    <FaUserCircle className="navbar-icon profile-icon" onClick={handleProfileClick} />
                                    {showProfileMenu && (
                                        <div className="profile-menu">
                                            <NavLink to="/perfil">Mi Perfil</NavLink>
                                            <NavLink to="/pedidos">Mis Pedidos</NavLink>
                                            <NavLink to="/favoritos">Mis Favoritos</NavLink>
                                            <button onClick={handleLogout}>Salir</button>  
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
