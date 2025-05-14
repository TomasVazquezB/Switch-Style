import React, { useState } from 'react';
import './admin.css';

const AdminPage = () => {
    const [usuariosList, setUsuariosList] = useState([
        { id: 1, nombre: 'Tomas', apellido: 'Vazquez Brouver', email: 'tomas.vazquez@davinci.edu.ar', rol: 'admin', favoritos: [] },
    ]);

    const [productosList, setProductosList] = useState([
        { id: 1, nombre: 'Producto A', descripcion: 'Descripción del Producto A' },
        { id: 2, nombre: 'Producto B', descripcion: 'Descripción del Producto B' },
        { id: 3, nombre: 'Producto C', descripcion: 'Descripción del Producto C' },
    ]);

    const [formDataUsuario, setFormDataUsuario] = useState({
        id: '',
        nombre: '',
        apellido: '',
        email: '',
        rol: 'usuario' 
    });

    const [formDataProducto, setFormDataProducto] = useState({
        id: '',
        nombre: '',
        descripcion: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [currentItem, setCurrentItem] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChangeUsuario = (e) => { setFormDataUsuario({...formDataUsuario, [e.target.name]: e.target.value}); };
    const handleChangeProducto = (e) => { setFormDataProducto({...formDataProducto, [e.target.name]: e.target.value}); };

    const handleSubmitUsuario = (e) => {
        e.preventDefault();
        const newUsuario = {
            id: usuariosList.length + 1,
            nombre: formDataUsuario.nombre,
            apellido: formDataUsuario.apellido,
            email: formDataUsuario.email,
            rol: formDataUsuario.rol,
            favoritos: [] 
        };
        setUsuariosList([...usuariosList, newUsuario]);
        setFormDataUsuario({
            id: '',
            nombre: '',
            apellido: '',
            email: '',
            rol: 'usuario' 
        });
    };

    const handleSubmitProducto = (e) => {
        e.preventDefault();
        const newProducto = {
            id: productosList.length + 1, 
            nombre: formDataProducto.nombre,
            descripcion: formDataProducto.descripcion
        };
        setProductosList([...productosList, newProducto]);
        setFormDataProducto({
            id: '',
            nombre: '',
            descripcion: ''
        });
    };

    const mostrarModal = (item, tipo) => {
        setCurrentItem({ item, tipo });
        setShowModal(true);
    };

    const mostrarEditModal = (item, tipo) => {
        setCurrentItem({ item, tipo });
        setShowEditModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setShowEditModal(false);
        setCurrentItem(null);
    };

    const confirmarEliminacion = () => {
        if (currentItem.tipo === 'usuario') {
            const updatedUsuarios = usuariosList.filter(usuario => usuario.id !== currentItem.item.id);
            setUsuariosList(updatedUsuarios);
            setSuccessMessage('Usuario eliminado con éxito.');
        } else if (currentItem.tipo === 'producto') {
            const updatedProductos = productosList.filter(producto => producto.id !== currentItem.item.id);
            setProductosList(updatedProductos);
            setSuccessMessage('Producto eliminado con éxito.');
        }
        setShowModal(false); 
    };

    const confirmarEdicion = () => {
        if (currentItem.tipo === 'usuario') {
            const updatedUsuarios = usuariosList.map(usuario => 
                usuario.id === currentItem.item.id ? { ...usuario, ...formDataUsuario } : usuario
            );
            setUsuariosList(updatedUsuarios);
            setSuccessMessage('Usuario editado con éxito.');
        } else if (currentItem.tipo === 'producto') {
            const updatedProductos = productosList.map(producto => 
                producto.id === currentItem.item.id ? { ...producto, ...formDataProducto } : producto
            );
            setProductosList(updatedProductos);
            setSuccessMessage('Producto editado con éxito.');
        }
        setShowEditModal(false); 
    };

    return (
        <div className="admin-container">
            <div>
                <div className="col admin-content">
                    <h1 className="admin-title">¡Bienvenido, Administrador!</h1>
                    <p className="admin-text">Esta es la página de administrador. Aquí puedes gestionar usuarios, productos.</p>
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
                                        <td>{usuario.rol}</td>
                                        <td>
                                            <button className="boton-editar" onClick={() => mostrarEditModal(usuario, 'usuario')}>Editar</button>
                                            <button className="boton-eliminar" onClick={() => mostrarModal(usuario, 'usuario')}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="form-registro-usuario">
                        <h3>Alta/Baja/Modificación de Productos</h3>
                        <br/>
                        <form onSubmit={handleSubmitProducto}>
                            <div className="form-row">
                                <input type="text" name="nombre" placeholder="Nombre del Producto" value={formDataProducto.nombre} onChange={handleChangeProducto} />
                            </div>
                            <div className="form-row">
                                <textarea name="descripcion" placeholder="Descripción del Producto" value={formDataProducto.descripcion} onChange={handleChangeProducto} />
                            </div>
                            <div className="form-row">
                                <button type="submit" className="btn btn-primary">Registrar Producto</button>
                            </div>
                        </form>
                    </div>

                    <br/>
                    <div className="productos-section">
                        <h3>Productos</h3>
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
                                {productosList.map(producto => (
                                    <tr key={producto.id}>
                                        <td>{producto.id}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>
                                            <button className="boton-editar" onClick={() => mostrarEditModal(producto, 'producto')}>Editar</button>
                                            <button className="boton-eliminar" onClick={() => mostrarModal(producto, 'producto')}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {successMessage && <div className="success-message">{successMessage}</div>}

                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Confirmación de Eliminación</h2>
                                <p>¿Estás seguro de que deseas eliminar este {currentItem.tipo === 'usuario' ? 'usuario' : 'producto'}?</p>
                                <div>
                                    <button className="btn btn-danger" onClick={confirmarEliminacion}>Confirmar</button>
                                    <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showEditModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Confirmación de Edición</h2>
                                <p>¿Estás seguro de que deseas editar este {currentItem.tipo === 'usuario' ? 'usuario' : 'producto'}?</p>
                                <div>
                                    <button className="btn btn-success" onClick={confirmarEdicion}>Confirmar</button>
                                    <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminPage;