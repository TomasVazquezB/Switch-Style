import React, { useState } from 'react';
import { registrarUsuario } from '../usuarios/usuarios';
import './registro.css';

export function RegistroPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        usuario: '',
        contrasena: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registrarUsuario(formData)
            .then(usuario => {
                alert(`Usuario ${usuario.nombre} registrado con éxito`);
                setFormData({
                    nombre: '',
                    apellido: '',
                    email: '',
                    usuario: '',
                    contrasena: ''
                });
            })
            .catch(error => {
                alert(error.message);
            });
    };

    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="box">
                    <div className="col-auto">
                        <div className="register_card">
                            <div className="form_container">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="input-group mb-3 col-12">
                                            <h1 className="bienvenida">Sign UP</h1>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group mb-3 col-6">
                                            <input type="text" name="nombre" className="form-control input_user" required placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                                        </div>
                                        <div className="input-group mb-3 col-6">
                                            <input type="text" name="apellido" className="form-control input_pass" required placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group mb-3 col-12">
                                            <input type="email" name="email" className="form-control input_user" required placeholder="Email" value={formData.email} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group mb-3 col-6">
                                            <input type="password" name="contrasena" className="form-control input_user" required placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} />
                                        </div>
                                        {/* <div className="input-group mb-3 col-6">
                                            <input type="password" name="repetir-contrasena" className="form-control input_pass" required placeholder="Repetir Contraseña" value={formData.repetir-contrasena} onChange={handleChange} />
                                        </div> */}
                                    </div>
                                    <div className="d-flex justify-content-center mt-3 login_container">
                                        <button type="submit" className="button-registro">Registrarse</button>
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
