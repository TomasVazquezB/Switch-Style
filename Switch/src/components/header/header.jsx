import React from 'react';
import './header.css'; // Asegúrate de importar tu archivo CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap'; 
import { FaSearch } from 'react-icons/fa'; // Icono de lupa

const Header = () => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => link.classList.remove('clicked'));
        e.target.classList.add('clicked');
        setTimeout(() => {
            e.target.classList.remove('clicked');
        }, 2000); 
    };

    return (
        <>
            <Navbar expand="lg" className="navbar-top bg-dark">
                <Container fluid style={{ maxWidth: "100%" }}>
                    <Navbar.Brand as={NavLink} to="/" onClick={() => navigate('/')}>
                        <img src="/src/assets/img/TurismoPOP.png" width="30" height="30" className="d-inline-block align-top" alt=""/>
                    </Navbar.Brand>

                    {/* Toggle Button (Para dispositivos móviles) */}
                    <Navbar.Toggle aria-controls="navbarNav" />

                    {/* Menú de navegación */}
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/faq" onClick={handleClick}>FAQ</Nav.Link>
                            <Nav.Link as={NavLink} to="/quienessomos" onClick={handleClick}>Quienes Somos</Nav.Link>

                            {/* Dropdown Menu */}
                            <Dropdown>
                                <Dropdown.Toggle variant="link" className="nav-link" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={NavLink} to="/action">Action</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/another-action">Another action</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={NavLink} to="/something-else">Something else here</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>

                        {/* Formulario de búsqueda */}
                        <div className="search-container">
                            <input className="search-input" type="search" placeholder="Buscar por producto, categoria o marca" aria-label="Search" />
                            <button className="search-btn">
                                <FaSearch />
                            </button>
                        </div>

                        {/* Enlaces de registro y login */}
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="/registro" activeClassName="active-link" onClick={handleClick}>Registro</Nav.Link>
                            <Nav.Link as={NavLink} to="/login" activeClassName="active-link" onClick={handleClick}>Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
