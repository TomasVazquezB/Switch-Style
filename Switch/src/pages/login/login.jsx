import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import Cookies from 'js-cookie';
import loginImage from '../../assets/login.jpg'; // Ajustá esta ruta según tu estructura

export function LoginPage() {
    const [formData, setFormData] = useState({ identificador: '', contrasena: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
        <div className="flex min-h-screen">
            {/* Imagen izquierda (35%) */}
            <div
                className="w-[35%] hidden md:block bg-cover bg-center"
                style={{ backgroundImage: `url(${loginImage})` }}
            ></div>

            {/* Formulario (65%) */}
            <div className="w-full md:w-[65%] flex items-center justify-center bg-white p-6">
                <div className="w-full max-w-xl border border-black rounded-xl px-12 py-14 text-center space-y-6 shadow-lg">
                    <h1 className="text-3xl font-bold">INGRESAR</h1>
                    <h3 className="text-gray-600">BIENVENIDO DE VUELTA</h3>

                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                        <input
                            type="text"
                            name="identificador"
                            placeholder="Email"
                            required
                            value={formData.identificador}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded border border-gray-300 bg-gray-50 text-black focus:outline-none focus:ring focus:ring-blue-200"
                        />

                        <input
                            type="password"
                            name="contrasena"
                            placeholder="Contraseña"
                            required
                            value={formData.contrasena}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring focus:ring-blue-200"
                        />

                        {error && (
                            <div className="bg-red-100 text-red-700 font-bold text-sm px-4 py-2 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
                        >
                            INGRESAR
                        </button>

                        <p className="text-sm text-center text-black mt-4">
                            ¿TODAVÍA NO ESTÁS REGISTRADO?{' '}
                            <Link to="/registro" className="text-blue-600 font-bold hover:underline">
                                REGÍSTRATE AQUÍ
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
