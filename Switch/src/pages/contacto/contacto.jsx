import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './contacto.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export function ContactoPage() {
  return (
    <div className="contacto-page">
      <h1 className="titulo-contacto">Nuestras Oficinas</h1>
      <br/>
      <div className="rectanglecontacto-mapa">
        <MapContainer center={[-34.603722, -58.381592]} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
          <Marker position={[-34.603722, -58.381592]}>
            <Popup></Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="rectanglecontacto-info">
        <div className="telefono">
          <p>1162657008</p>
          <p>0800-222-1254</p>
        </div>
        <div className="email">
          <p>Email: consultas@switchstyle.com</p>
        </div>
        <div className="redes-sociales">
          <p>Redes Sociales: Switch Style</p>
        </div>
      </div>
    </div>
  );
}
