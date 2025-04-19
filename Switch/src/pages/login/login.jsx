import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../usuarios/usuarios';
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

        const updateMode = () => {
            setIsDarkMode(checkDarkMode());
        };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUsuario(formData.identificador, formData.contrasena)
            .then(usuario => {
                if (usuario.rol === 'admin') {
                    alert(`Bienvenido Administrador ${usuario.nombre}`);
                    navigate('/admin');
                } else {
                    alert(`Bienvenido Usuario ${usuario.nombre}`);
                    navigate('/');
                }
            })
            .catch(error => setError(error.message));
    };

    return (
        <div className={`login-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="image-container">
                <img src="/img/login.jpg" alt="Imagen" className="login-image" />
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
                    </form>
                </div>
            </div>
        </div>
    );
}
