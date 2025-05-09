import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

export function LoginPage() {
    const [formData, setFormData] = useState({ identificador: '', contrasena: '' });
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkDarkMode = () => {
            const bodyDark = document.body.classList.contains('dark');
            const htmlDark = document.documentElement.classList.contains('dark');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return bodyDark || htmlDark || systemDark;
        };

        const updateMode = () => setIsDarkMode(checkDarkMode());

        updateMode();

        const observer = new MutationObserver(updateMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateMode);

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener('change', updateMode);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reinicia error si hay uno previo

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar usuario completo
                localStorage.setItem('usuario', JSON.stringify(data));

                const rol = data.rol?.toLowerCase();
                const nombre = data.nombre || 'Usuario';

                if (rol === 'admin') {
                    alert(`Bienvenido Administrador ${nombre}`);
                    navigate('/admin');
                } else {
                    alert(`Bienvenido ${nombre}`);
                    navigate('/');
                }
            } else {
                setError(data.message || 'Credenciales inválidas');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión al servidor.');
        }
    };

    return (
        <div className={`login-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="image-container">
                <img src="../src/assets/login.jpg" alt="Imagen" className="login-image" />
            </div>

            <div className="login-box">
                <div className="login-form">
                    <h1 className="bienvenida">Ingresar</h1>
                    <h3 className="bienvenido">Bienvenido de vuelta</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="identificador"
                            className="form-control input_user"
                            required
                            placeholder="Email"
                            value={formData.identificador}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="contrasena"
                            className="form-control input_pass"
                            required
                            placeholder="Contraseña"
                            value={formData.contrasena}
                            onChange={handleChange}
                        />

                        {error && <div className="alert alert-danger">{error}</div>}

                        <button type="submit" className="button-login">Ingresar</button>

                        <p className="registro-link">
                            ¿Todavía no estás registrado? <Link to="/registro">Regístrate aquí</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}