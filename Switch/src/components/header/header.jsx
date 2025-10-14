import React, { useState, useEffect } from "react";
import "./header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";
import { useLocation } from "react-router-dom";

const Header = ({ toggleTheme, darkMode }) => {
  const [usuario, setUsuario] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const handleClick = (e) => {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => link.classList.remove("clicked"));
    e.target.classList.add("clicked");
    setTimeout(() => {
      e.target.classList.remove("clicked");
    }, 2000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // 🧹 Limpia el campo después de buscar
    }
  };

  const handleProfileClick = () => setShowProfileMenu(!showProfileMenu);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setShowProfileMenu(false);
    navigate("/login");
  };

  useEffect(() => {
    const actualizarUsuario = () => {
      const userData = localStorage.getItem("usuario");
      if (userData) {
        setUsuario(JSON.parse(userData));
      } else {
        setUsuario(null);
      }
    };

    actualizarUsuario();
    window.addEventListener("usuario-actualizado", actualizarUsuario);
    return () =>
      window.removeEventListener("usuario-actualizado", actualizarUsuario);
  }, []);

  useEffect(() => {
    setSearchQuery(""); // 🧼 Limpia el input al montar el header
  }, []);

  useEffect(() => {
    setSearchQuery(""); // 🧭 Limpia el buscador al cambiar de ruta
  }, [location.pathname]);

  const goToCart = () => navigate("/carrito");

  useEffect(() => {
    const body = document.body;
    const navbars = document.querySelectorAll(".navbar-top, .navbar-bottom");
    body.classList.remove("dark-mode", "light-mode");
    navbars.forEach((nav) => nav.classList.remove("navbar-light-mode"));

    if (darkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.add("light-mode");
      navbars.forEach((nav) => nav.classList.add("navbar-light-mode"));
    }
  }, [darkMode]);

  const getLinkClass = (isActive) =>
    `nav-link ${darkMode ? "text-white" : "text-dark"} ${isActive ? "active-link" : ""
    }`;

  return (
    <>
      <div
        className={`offer-bar ${darkMode ? "bg-ultra-light" : "bg-ultra-dark"
          } text-center pt-4 pb-2`}
      >
        <p className="offer-bar-text">
          ¡Registrate para obtener ofertas unicas y obten un 15% en tu primer
          compra!
        </p>
      </div>

      <Navbar
        expand="lg"
        className={`navbar-top ${darkMode ? "bg-dark" : "bg-light"}`}
      >
        <Container fluid>
          <Navbar.Brand
            as={NavLink}
            to="/"
            onClick={() => navigate("/")}
          >
            <img
              src="https://res.cloudinary.com/switchstyle/image/upload/v1756993378/Logo%20Switch%20Style.png"
              width="90"
              height="50"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="me-auto">
              <div className="mode-switch">
                <BsMoon
                  className={`mode-icon ${darkMode ? "active" : "inactive"}`}
                />
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={toggleTheme}
                    checked={darkMode}
                  />
                  <span className="slider"></span>
                </label>
                <BsSun
                  className={`mode-icon ${darkMode ? "inactive" : "active"}`}
                />
              </div>
            </Nav>

            <Container fluid>
              <Nav
                className="navbar-ropa"
                style={{ justifyContent: "space-evenly", width: "100%" }}
              >
                <div className="nav-dropdown">
                  <Nav.Link
                    as={NavLink}
                    to="/MainHombres"
                    className={({ isActive }) => getLinkClass(isActive)}
                  >
                    Hombres
                  </Nav.Link>
                  <div className="dropdown-menu">
                    <NavLink
                      to="/ropa/hombres/remeras"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Remeras
                    </NavLink>
                    <NavLink
                      to="/ropa/hombres/pantalones"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Pantalones
                    </NavLink>
                    <NavLink
                      to="/ropa/hombres/camperas"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Camperas
                    </NavLink>
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
                    <NavLink
                      to="/ropa/mujeres/remeras"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Remeras
                    </NavLink>
                    <NavLink
                      to="/ropa/mujeres/pantalones"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Pantalones
                    </NavLink>
                    <NavLink
                      to="/ropa/mujeres/camperas"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Camperas
                    </NavLink>
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
                    <NavLink
                      to="/ropa/kids/remeras"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Remeras
                    </NavLink>
                    <NavLink
                      to="/ropa/kids/pantalones"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Pantalones
                    </NavLink>
                    <NavLink
                      to="/ropa/kids/camperas"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Camperas
                    </NavLink>
                  </div>
                </div>
                <div className="nav-dropdown">
                  <Nav.Link
                    as={NavLink}
                    to="/accesorios"
                    className={({ isActive }) => getLinkClass(isActive)}
                  >
                    Accesorios
                  </Nav.Link>
                  <div className="dropdown-menu">
                    <NavLink
                      to="/accesorios/cadenas"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Cadenas
                    </NavLink>
                    <NavLink
                      to="/accesorios/anillos"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Anillos
                    </NavLink>
                    <NavLink
                      to="/accesorios/brazaletes"
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      Brazaletes
                    </NavLink>
                  </div>
                </div>
              </Nav>
            </Container>

            <div className="search-bar">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-icon-btn">
                  <FaSearch size={18} />
                </button>
              </form>
            </div>

            <Nav.Link onClick={goToCart} className="carrito">
              <FaShoppingCart
                size={21}
                className={`navbar-icon ${darkMode ? "text-white" : "text-dark"
                  }`}
              />
            </Nav.Link>

            <Nav className="ms-auto">
  <div className="profile-container">
    <Nav.Link
      as="div"
      onClick={usuario ? handleProfileClick : () => navigate("/login")}
      className="login-buttom"
      style={{ cursor: "pointer" }}
    >
      <FaUser size={20} />
    </Nav.Link>

    {usuario && showProfileMenu && (
      <div className="profile-menu">
           <div className="px-4 py-2 border-b border-gray-200 text-sm font-medium">
          Hola, {usuario.nombre}
        </div>

         <NavLink
          to="/MisPedidos"
          className={`block px-4 py-2 text-sm ${darkMode ? "text-white hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"}`}
        >
          Mis pedidos
         </NavLink>
        <NavLink
          to="/favoritos"
          className={`block px-4 py-2 text-sm ${darkMode ? "text-white hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"}`}
        >
          Mis favoritos
        </NavLink>
        <a
        href="https://switchstyle.laravel.cloud/login"
        className={`block px-4 py-2 text-sm ${darkMode ? "text-white hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"}`}
> 
  Ir al Gestor de Productos
</a>
        <button
          onClick={handleLogout}
          className="block px-4 py-2 text-sm w-full text-left"
        >
          Cerrar sesión
        </button>
      </div>
    )}
  </div>
</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;