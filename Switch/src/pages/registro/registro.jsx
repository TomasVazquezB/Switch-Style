import React, { useState } from 'react';
import { registrarUsuario } from '../usuarios/usuarios';
import './registro.css';

export function RegistroPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        usuario: '',
        contrasena: '',
        aceptarTerminos: false,
    });

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value,});
    };

    const handleCheckboxChange = (e) => {
        setFormData({...formData,aceptarTerminos: e.target.checked,});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.aceptarTerminos) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }
        registrarUsuario(formData)
            .then((usuario) => {
                alert(`Usuario ${usuario.nombre} registrado con éxito`);
                setFormData({
                    nombre: '',
                    apellido: '',
                    email: '',
                    usuario: '',
                    contrasena: '',
                    aceptarTerminos: false,
                });
            })
            .catch((error) => {alert(error.message);});
    };

    return (
        <div className="registro-container">
            <div className="image-container">
                <img src="/registro.jpg" alt="Imagen" className="registro-image" />
            </div>
            <div className="registro-box">
                <div className="registro-form">
                    <form onSubmit={handleSubmit}>
                        <h1 className="bienvenida">Registrarse</h1>
                        <h3 className="informacion-registro">Registrate para unirte a nuestra comunidad</h3>
                        <div className="form-row">
                            <div className="input-group mb-3 col-6">
                                <input 
                                    type="text" 
                                    name="nombre" 
                                    className="form-control input_user" 
                                    required 
                                    placeholder="Nombre" 
                                    value={formData.nombre} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="input-group mb-3 col-6">
                                <input 
                                    type="text" 
                                    name="apellido" 
                                    className="form-control input_user" 
                                    required 
                                    placeholder="Apellido" 
                                    value={formData.apellido} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-group mb-3 col-12">
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="form-control input_user" 
                                    required 
                                    placeholder="Email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-group mb-3 col-6">
                                <input 
                                    type="password" 
                                    name="contrasena" 
                                    className="form-control input_pass" 
                                    required 
                                    placeholder="Contraseña" 
                                    value={formData.contrasena} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className="form-row aceptar-terminos">
                            <input 
                                type="checkbox" 
                                name="aceptarTerminos" 
                                checked={formData.aceptarTerminos} 
                                onChange={handleCheckboxChange} 
                            />
                            <span>Acepto los términos y condiciones</span>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button type="submit" className="button-registro">Registrarse</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
