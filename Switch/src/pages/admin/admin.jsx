import React, { useState } from 'react';
import './admin.css';

const AdminPage = () => {
    const [usuariosList, setUsuariosList] = useState([
        { id: 1, nombre: 'Tomas', apellido: 'Vazquez Brouver', email: 'tomas.vazquez@davinci.edu.ar', usuario: 'tomas', rol: 'admin' },
    ]);

    const [paquetesList, setPaquetesList] = useState([
        { id: 1, nombre: '', descripcion: '' },
        { id: 2, nombre: '', descripcion: '' },
        { id: 3, nombre: '', descripcion: '' },
    ]);

    const [actividadesList, setActividadesList] = useState([
        { id: 1, nombre: '', descripcion: '' },
        { id: 2, nombre: '', descripcion: '' },
        { id: 3, nombre: '', descripcion: '' },
    ]);

    const [formDataUsuario, setFormDataUsuario] = useState({
        id: '',
        nombre: '',
        apellido: '',
        email: '',
        usuario: '',
        rol: 'usuario' 
    });

    const [formDataPaquete, setFormDataPaquete] = useState({
        id: '',
        nombre: '',
        descripcion: ''
    });

    const [formDataActividad, setFormDataActividad] = useState({
        id: '',
        nombre: '',
        descripcion: ''
    });

    const handleChangeUsuario = (e) => {
        setFormDataUsuario({...formDataUsuario,[e.target.name]: e.target.value});
    };

    const handleChangePaquete = (e) => {
        setFormDataPaquete({...formDataPaquete,[e.target.name]: e.target.value});
    };

    const handleChangeActividad = (e) => {
        setFormDataActividad({...formDataActividad,[e.target.name]: e.target.value});
    };

    const handleSubmitUsuario = (e) => {
        e.preventDefault();
        const newUsuario = {
            id: usuariosList.length + 1,
            nombre: formDataUsuario.nombre,
            apellido: formDataUsuario.apellido,
            email: formDataUsuario.email,
            usuario: formDataUsuario.usuario,
            rol: formDataUsuario.rol
        };
        setUsuariosList([...usuariosList, newUsuario]);
        setFormDataUsuario({
            id: '',
            nombre: '',
            apellido: '',
            email: '',
            usuario: '',
            rol: 'usuario' 
        });
    };


    const handleSubmitPaquete = (e) => {
        e.preventDefault();
        const newPaquete = {
            id: paquetesList.length + 1, 
            nombre: formDataPaquete.nombre,
            descripcion: formDataPaquete.descripcion
        };
        setPaquetesList([...paquetesList, newPaquete]);
        setFormDataPaquete({
            id: '',
            nombre: '',
            descripcion: ''
        });
    };

    const handleSubmitActividad = (e) => {
        e.preventDefault();
        const newActividad = {
            id: actividadesList.length + 1, 
            nombre: formDataActividad.nombre,
            descripcion: formDataActividad.descripcion
        };
        setActividadesList([...actividadesList, newActividad]);
        setFormDataActividad({
            id: '',
            nombre: '',
            descripcion: ''
        });
    };

    const eliminarUsuario = (id) => {
        const updatedUsuarios = usuariosList.filter(usuario => usuario.id !== id);
        setUsuariosList(updatedUsuarios);
    };

    const eliminarPaquete = (id) => {
        const updatedPaquetes = paquetesList.filter(paquete => paquete.id !== id);
        setPaquetesList(updatedPaquetes);
    };

    const eliminarActividad = (id) => {
        const updatedActividades = actividadesList.filter(actividad => actividad.id !== id);
        setActividadesList(updatedActividades);
    };

    return (
        <div className="admin-container">
            <div className="row">
                <div className="col admin-content">
                    <h1 className="admin-title">¡Bienvenido, Administrador!</h1>
                    <p className="admin-text">Esta es la página de administrador. Aquí puedes gestionar usuarios y otras funciones administrativas.</p>
                    <br/>
                    <div className="form-registro-usuario">
                        <h3>Alta/Baja/Modificación de Usuarios</h3>
                        <br/>
                        <form onSubmit={handleSubmitUsuario}>
                            <div className="form-row">
                                <input type="text" name="nombre" placeholder="Nombre" value={formDataUsuario.nombre} onChange={handleChangeUsuario} />
                                <input type="text" name="apellido" placeholder="Apellido" value={formDataUsuario.apellido} onChange={handleChangeUsuario} />
                            </div>
                            <div className="form-row">
                                <input type="email" name="email" placeholder="Email" value={formDataUsuario.email} onChange={handleChangeUsuario} />
                                <input type="text" name="usuario" placeholder="Usuario" value={formDataUsuario.usuario} onChange={handleChangeUsuario} />
                            </div>
                            <div className="form-row">
                                <select name="rol" value={formDataUsuario.rol} onChange={handleChangeUsuario}>
                                    <option value="usuario">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <button type="submit" className="btn btn-primary">Registrar Usuario</button>
                            </div>
                        </form>
                    </div>
                    <br/>
                    <br/>
                    <div className="usuarios-section">
                        <h3>Usuarios</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosList.map(usuario => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.apellido}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.usuario}</td>
                                        <td>{usuario.rol}</td>
                                        <td>
                                            <button className="boton-editar">Editar</button>
                                            <button className="boton-eliminar" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br/>   

                    <div className="form-paquetes-actividades">
                        <h3>Alta/Baja/Modificación</h3>
                        <br/>
                        <form onSubmit={handleSubmitPaquete}>
                            <div className="form-row">
                                <input type="text" name="nombre" placeholder="Nombre del Paquete" value={formDataPaquete.nombre} onChange={handleChangePaquete} />
                                <textarea name="descripcion" placeholder="Descripción del Paquete" value={formDataPaquete.descripcion} onChange={handleChangePaquete}></textarea>
                            </div>
                            <div className="form-row">
                                <button type="submit" className="btn btn-primary">Guardar Paquete</button>
                            </div>
                        </form>
                    </div>
                    <br/>
                    <div className="paquetes-section">
                        <h3>Paquetes</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paquetesList.map(paquete => (
                                    <tr key={paquete.id}>
                                        <td>{paquete.id}</td>
                                        <td>{paquete.nombre}</td>
                                        <td>{paquete.descripcion}</td>
                                        <td>
                                            <button className="boton-editar">Editar</button>
                                            <button className="boton-eliminar" onClick={() => eliminarPaquete(paquete.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br/>
           
                    <div className="form-paquetes-actividades">
                        <h3>Alta/Baja/Modificación de Actividades</h3>
                        <br/>
                        <form onSubmit={handleSubmitActividad}>
                            <div className="form-row">
                                <input type="text" name="nombre" placeholder="Nombre de la Actividad" value={formDataActividad.nombre} onChange={handleChangeActividad} />
                                <textarea name="descripcion" placeholder="Descripción de la Actividad" value={formDataActividad.descripcion} onChange={handleChangeActividad}></textarea>
                            </div>
                            <div className="form-row">
                                <button type="submit" className="btn btn-primary">Guardar Actividad</button>
                            </div>
                        </form>
                    </div>
                    <br/>
                    <div className="actividades-section">
                        <h3>Actividades</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actividadesList.map(actividad => (
                                    <tr key={actividad.id}>
                                        <td>{actividad.id}</td>
                                        <td>{actividad.nombre}</td>
                                        <td>{actividad.descripcion}</td>
                                        <td>
                                            <button className="boton-editar">Editar</button>
                                            <button className="boton-eliminar" onClick={() => eliminarActividad(actividad.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
