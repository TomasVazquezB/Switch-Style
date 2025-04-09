import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../usuarios/usuarios';
import './login.css';

export function LoginPage() {
    const [formData, setFormData] = useState({
        identificador: '',
        contrasena: ''
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado con:', formData);
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
            .catch(error => {
                setError(error.message);
            });
    };

    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="box">
                    <div className="col-auto">
                        <div className="register_card">
                            <div className="d-flex justify-content-center form_container">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="input-group mb-3 col-12">
                                            <h1 className="bienvenida">Ingresar</h1>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group mb-3 col-12">
                                            <input type="text" name="identificador" className="form-control input_user" required placeholder="Correo electrónico o usuario" value={formData.identificador} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group mb-3 col-12">
                                            <input type="password" name="contrasena" className="form-control input_pass" required placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} />
                                        </div>
                                    </div>
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                    <div className="d-flex justify-content-center mt-3 login_container">
                                        <button type="submit" className="button-login">Ingresar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
