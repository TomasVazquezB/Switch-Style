// src/services/firebaseAdmin.js
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Leer todos los usuarios
export const fetchUsuarios = async () => {
  const querySnapshot = await getDocs(collection(db, 'usuarios'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (id) => {
  await deleteDoc(doc(db, 'usuarios', id));
};
