import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "../../context/DataContext.jsx";
import api from "../../api/axios.js";
import "./pedidos.css";

export function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useContext(DataContext) || {};

  useEffect(() => {
    if (!usuario) {
      setLoading(false);
      return;
    }

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await api.get("/mis-pedidos", { withCredentials: true });
        setPedidos(response.data || []);
      } catch (err) {
        console.error("❌ Error al obtener pedidos:", err);
        setError("No se pudieron cargar tus pedidos. Por favor, intenta nuevamente más tarde");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [usuario]);

  if (loading)
    return <div className="pedidos-loading">Cargando tus pedidos...</div>;

  if (!usuario) {
    return (
      <div className="cartel-sesion">
        <div className="cartel-sesion-contenido">
          <h2>🔒 Debes iniciar sesión para ver tus pedidos</h2>
          <p>Inicia sesión para acceder al historial de tus compras</p>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="pedidos-error">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="mis-pedidos-container">
      <h1 className="titulo-pedidos">
        {`Pedidos de ${usuario.Nombre || usuario.name}`}
      </h1>

      {pedidos.length === 0 ? (
        <p className="sin-pedidos">No tienes pedidos registrados todavía</p>
      ) : (
        <div className="lista-pedidos">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <span className="pedido-id">#{pedido.id}</span>
                <span className={`estado ${pedido.estado.toLowerCase()}`}>{pedido.estado}</span>
              </div>
              <div className="pedido-detalle">
                <p><strong>Fecha:</strong> {new Date(pedido.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
                <p><strong>Dirección:</strong> {pedido.direccion_envio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisPedidos;