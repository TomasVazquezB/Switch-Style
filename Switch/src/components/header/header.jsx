import React from 'react';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';

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
            <Navbar className="navbar-top">
                <Container className="d-flex justify-content-between" style={{ maxWidth: "100%" }}>
                    <div className="d-flex align-items-center">
                        <Navbar.Brand as={NavLink} to="/" onClick={() => navigate('/')}>
                            <img src="/src/assets/img/TurismoPOP.png" width="30" height="30" className="d-inline-block align-top" alt=""/>
                        </Navbar.Brand>
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="/contacto" onClick={handleClick}>Contacto</Nav.Link>
                            <Nav.Link as={NavLink} to="/faq" onClick={handleClick}>FAQ</Nav.Link>
                            <Nav.Link as={NavLink} to="/quienessomos" onClick={handleClick}>Quienes Somos</Nav.Link>
                        </Nav>
                    </div>
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/registro" onClick={handleClick}>Sign Up</Nav.Link>
                        <Nav.Link as={NavLink} to="/login" onClick={handleClick}>Login</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
