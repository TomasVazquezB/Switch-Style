let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
    { id: 1, nombre: 'Tomas', apellido: 'Vazquez Brouver', email: 'tomas.vazquez@davinci.edu.ar', usuario: 'tomas', contrasena: '1234', rol: 'admin' },
];

function guardarUsuarios(users) {localStorage.setItem('usuarios', JSON.stringify(users));
}

export function loginUsuario(identificador, contrasena) {
    return new Promise((resolve, reject) => {usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        console.log('Intentando iniciar sesión con:', identificador, contrasena);
        const encontrado = usuarios.find(u => (u.usuario === identificador || u.email === identificador) && u.contrasena === contrasena);

        if (encontrado) {
            console.log('Usuario encontrado:', encontrado);
            resolve(encontrado); 
        } else {
            console.log('Usuario no encontrado');
            reject(new Error('Usuario o contraseña incorrectos')); 
        }
    });
}

export function registrarUsuario(datosRegistro) {
    return new Promise((resolve, reject) => {
        const nuevoUsuario = {
            id: usuarios.length + 1, 
            rol: 'user', 
            ...datosRegistro
        };
        usuarios.push(nuevoUsuario); 
        guardarUsuarios(usuarios); 
        resolve(nuevoUsuario);
    });
}

if (!localStorage.getItem('usuarios')) {guardarUsuarios(usuarios);
}