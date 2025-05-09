import { useEffect, useState } from 'react';
import axios from 'axios';

function TestLaravel() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/mensaje')
  .then(res => {
    console.log(res.data); // ⬅️ Agregá esto
    setMensaje(res.data.mensaje);
  })
  .catch(err => console.error('Error al conectar con Laravel:', err));
  }, []);

  return (
    <div>
      <h2>Mensaje del backend Laravel:</h2>
      <p>{mensaje}</p>
    </div>
  );
}

export default TestLaravel;
