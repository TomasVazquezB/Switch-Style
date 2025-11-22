import React, { useState, useEffect, useContext } from "react";
import "./header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";
import { DataContext } from "../../context/DataContext";

const Header = ({ toggleTheme, darkMode }) => {
  const [usuario, setUsuario] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { productos } = useContext(DataContext);

  useEffect(() => {
    const actualizarUsuario = () => {
      const userData = localStorage.getItem("usuario");
      setUsuario(userData ? JSON.parse(userData) : null);
    };
    actualizarUsuario();
    window.addEventListener("usuario-actualizado", actualizarUsuario);
    return () => {
      window.removeEventListener("usuario-actualizado", actualizarUsuario);
    };
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setShowProfileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileContainer = document.querySelector(".profile-container");
      if (profileContainer && !profileContainer.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const producto = productos.find(
      (p) =>
        p.titulo &&
        p.titulo.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (producto) {
      const tipo = producto.tipo?.toLowerCase();
      if (tipo === "accesorios") navigate(`/producto/accesorios/${producto.id}`);
      else navigate(`/producto/ropa/${producto.id}`);
    }

    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (p) => {
    if (!p) return;
    const tipo = p.tipo?.toLowerCase();
    if (tipo === "accesorios") navigate(`/producto/accesorios/${p.id}`);
    else navigate(`/producto/ropa/${p.id}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const goToCart = () => navigate("/carrito");

  const handleProfileClick = () =>
    setShowProfileMenu((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setShowProfileMenu(false);
    navigate("/login");
  };

  const handleGoToPanel = () => {
    const userData = JSON.parse(localStorage.getItem("usuario"));
    const token = userData?.token;
    if (!token) {
      window.location.href = "https://switchstyle.laravel.cloud/login";
      return;
    }
    const panelUrl = `https://switchstyle.laravel.cloud/auto-login?token=${token}`;
    window.location.href = panelUrl;
  };

  const getLinkClass = (isActive) =>
    `nav-link ${darkMode ? "text-white" : "text-dark"} ${
      isActive ? "active-link" : ""
    }`;

  const filteredSuggestions =
    searchQuery.length > 0
      ? productos
          .filter((p) =>
            `${p.titulo || ""} ${p.tipo || ""} ${p.descripcion || ""}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  return (
    <>
      <div
        className={`offer-bar ${
          darkMode ? "bg-dark text-white" : "bg-light text-dark"
        } text-center pt-2 pb-1`}
      >
        <p className="offer-bar-text">
          ¡Registrate para obtener ofertas únicas y obtené un 15% en tu primer compra!
        </p>
      </div>

      <Navbar
        expand="lg"
        className={`navbar-top ${darkMode ? "bg-dark" : "bg-light"}`}
      >
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/">
            <img
              src="https://res.cloudinary.com/switchstyle/image/upload/v1756993378/Logo%20Switch%20Style.png"
              width="90"
              height="50"
              alt="Logo Switch Style"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="me-auto align-items-center">
              <div className="mode-switch d-flex align-items-center me-3">
                <BsSun
                  className={`mode-icon ${
                    darkMode ? "active text-white" : "inactive text-dark"
                  }`}
                />
                <label className="switch mx-2">
                  <input
                    type="checkbox"
                    onChange={toggleTheme}
                    checked={darkMode}
                  />
                  <span className="slider"></span>
                </label>
                <BsMoon
                  className={`mode-icon ${
                    darkMode ? "inactive text-secondary" : "active text-warning"
                  }`}
                />
              </div>
            </Nav>

            <Nav
              className="navbar-ropa"
              style={{ justifyContent: "space-evenly", width: "100%" }}
            >
              <Nav.Link
                as={NavLink}
                to="/MainHombres"
                className={({ isActive }) => getLinkClass(isActive)}
              >
                Hombres
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/MainMujeres"
                className={({ isActive }) => getLinkClass(isActive)}
              >
                Mujeres
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/MainKids"
                className={({ isActive }) => getLinkClass(isActive)}
              >
                Chicos
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/accesorios"
                className={({ isActive }) => getLinkClass(isActive)}
              >
                Accesorios
              </Nav.Link>
            </Nav>

            <div className="search-bar" style={{ position: "relative" }}>
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  className={`search-input ${
                    darkMode ? "bg-dark text-white" : "bg-light text-dark"
                  }`}
                />
                <button type="submit" className="search-icon-btn">
                  <FaSearch size={18} />
                </button>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div
                    className={`search-suggestions ${
                      darkMode ? "dark" : "light"
                    }`}
                  >
                    {filteredSuggestions.map((p) => (
                      <div
                        key={p.id}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(p)}
                      >
                        <div className="suggestion-info">
                          <span className="suggestion-title">
                            {p.titulo}
                          </span>
                          <span className="suggestion-price">
                            ${p.precio || p.Precio}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            <Nav.Link onClick={goToCart} className="carrito">
              <FaShoppingCart
                size={21}
                className={`navbar-icon ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              />
            </Nav.Link>

            <Nav className="ms-auto">
              <div className="profile-container">
                <Nav.Link
                  as="div"
                  onClick={
                    usuario
                      ? handleProfileClick
                      : () => navigate("/login")
                  }
                  className="login-buttom"
                  style={{ cursor: "pointer" }}
                >
                  <FaUser
                    size={20}
                    className={darkMode ? "text-white" : "text-dark"}
                  />
                </Nav.Link>

                {usuario && showProfileMenu && (
                  <div
                    className={`profile-menu ${
                      darkMode ? "bg-dark text-white" : "bg-light text-dark"
                    }`}
                  >
                    <div className="px-4 py-2 border-b text-sm">
                      Hola {usuario.nombre}
                    </div>
                    <NavLink
                      to="/pedidos"
                      className="profile-link"
                    >
                      Mis pedidos
                    </NavLink>
                    <NavLink
                      to="/favoritos"
                      className="profile-link"
                    >
                      Mis favoritos
                    </NavLink>
                    <button
                      onClick={handleGoToPanel}
                      className="profile-link w-100 text-left"
                    >
                      Panel de Productos
                    </button>
                    <button
                      onClick={handleLogout}
                      className="profile-link w-100 text-left"
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
