import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import app from '../firebase/firebase';

const auth = getAuth(app);

// 🔐 Iniciar sesión
export const loginFirebase = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

// 📝 Registrarse
export const registerFirebase = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

// 🚪 Cerrar sesión
export const logoutFirebase = () => signOut(auth);
