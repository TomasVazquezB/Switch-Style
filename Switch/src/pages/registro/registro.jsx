import React, { useState } from 'react';
import { registrarUsuario } from '../../api/usuarios/usuarios.js';
import './registro.css';

export function RegistroPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        contrasena: '',
        aceptarTerminos: false,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, aceptarTerminos: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.aceptarTerminos) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }

        try {
            const usuario = await registrarUsuario(formData);
            alert(`Usuario ${usuario.usuario?.nombre || "Nuevo usuario"} registrado con éxito`);


            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                contrasena: '',
                aceptarTerminos: false,
            });
        } catch (error) {
            alert(error.message || 'Error al registrar usuario');
        }
    };

    return (
        <div className="registro-container">
            <div className="image-container">
                <img
                    src="https://res.cloudinary.com/switchstyle/image/upload/v1756993810/registro_i9jpqb.jpg"
                    alt="Imagen"
                    className="registro-image"
                />
            </div>
            <div className="registro-box">
                <div className="registro-form">
                    <form onSubmit={handleSubmit}>
                        <h1 className="bienvenida">cabeza de plomo</h1>
                        <h3 className="informacion-registro">Registrate para unirte a nuestra comunidad</h3>

                        <div className="form-row">
                            <div className="input-group col-6">
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="form-control input_user"
                                />
                            </div>
                            <div className="input-group col-6">
                                <input
                                    type="text"
                                    name="apellido"
                                    placeholder="Apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    className="form-control input_user"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group col-12">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="form-control input_user"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group col-6">
                                <input
                                    type="password"
                                    name="contrasena"
                                    placeholder="Contraseña"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required
                                    className="form-control input_pass"
                                />
                            </div>
                        </div>

                        <div className="aceptar-terminos">
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