import api from "../axios.js";

export const registrarUsuario = async (data) => {
  try {
    // 1️⃣ Obtener cookie CSRF igual que el login
    await api.get("/sanctum/csrf-cookie");

    // 2️⃣ Enviar los datos al endpoint correcto
    const response = await api.post(
      "/api/register",
      {
        nombre: data.nombre,
        correo: data.email,         
        password: data.contrasena,  
        tipo: 'Free',               
      },
      { withCredentials: true }
    );


    return response.data;
  } catch (error) {
    console.error("Error registrando usuario:", error.response?.data || error);
    throw error.response?.data || { message: "Error al registrar usuario" };
  }
};
