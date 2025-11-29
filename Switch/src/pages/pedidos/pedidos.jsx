import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "../../context/DataContext.jsx";
import { secureApi } from "../../api/axios";
import "./pedidos.css";

export function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useContext(DataContext) || {};
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        await secureApi.get("https://switchstyle.laravel.cloud/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        const response = await secureApi.get("/mis-pedidos", {
          withCredentials: true,
        });
        setPedidos(response.data || []);
      } catch (err) {
        console.error("❌ Error al obtener pedidos:", err);
        setError("No se pudieron cargar tus pedidos. Por favor, intenta nuevamente más tarde");
      } finally {
        setLoading(false);
      }
    };

    if (usuario) fetchPedidos();
  }, [usuario]);

  useEffect(() => {
    if (usuario?.Nombre || usuario?.name || usuario?.nombre) {
      setNombreUsuario(usuario.Nombre || usuario.name || usuario.nombre);
    }
  }, [usuario]);


  if (loading)
    if (!usuario?.Nombre && !usuario?.name && !usuario?.nombre) {
      return <div className="pedidos-loading">Cargando tus pedidos...</div>;
    }

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
        Pedidos de {usuario?.nombre ?? "Usuario"}
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
                <p>
                  <strong>Total:</strong> $
                  {Number(pedido.total ?? 0).toFixed(2)}
                </p>
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