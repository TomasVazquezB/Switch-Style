import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './login.css';
import Cookies from 'js-cookie';
import loginImage from '../../assets/login.jpg'; // Ajustá esta ruta según tu estructura

export function LoginPage() {
    const [formData, setFormData] = useState({ identificador: '', contrasena: '' });
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* useEffect(() => {
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
    }, []); */


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await api.get('/sanctum/csrf-cookie');
            const csrfToken = Cookies.get('XSRF-TOKEN');

            const response = await api.post(
                '/api/login',
                {
                    email: formData.identificador,
                    password: formData.contrasena,
                },
                {
                    headers: {
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                }
            );

            const user = response.data;
            localStorage.setItem('usuario', JSON.stringify(user));
            window.dispatchEvent(new Event('usuario-actualizado'));
            alert(`Bienvenido ${user.nombre || ''}`);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al iniciar sesión.');
        }
    };

    return (
        <div className="login-container">

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
                            placeholder="Email"
                            required
                            value={formData.identificador}
                            onChange={handleChange}
                            className="form-control input_user"
                        />

                        <input
                            type="password"
                            name="contrasena"
                            placeholder="Contraseña"
                            required
                            value={formData.contrasena}
                            onChange={handleChange}
                            className="form-control input_user"
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
