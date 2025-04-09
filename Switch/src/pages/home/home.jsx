import React from 'react';
import "./home.css";
import Card from 'react-bootstrap/Card';

const Home = () => {
  return (
      <div className="home-index"> 
    <h2 className='titulo'>Ofertas, que no te puedes perder</h2>
    <Card className="card-home">
    <Card.Img variant="top" src="src/assets/img/madrid.jpg"/>
    <Card.Body>
        <Card.Title>Paquete a Madrid</Card.Title>
        <Card.Text> Descubre Madrid con nuestros paquetes de viaje a precios irresistibles. Reserva ahora y vive una experiencia inolvidable en la capital de España.</Card.Text>
    </Card.Body>
</Card>

<Card className="card-home">
    <Card.Img variant="top" src="src/assets/img/patagonia.jpg"/>
    <Card.Body>
        <Card.Title>Senderismo por la Patagonia</Card.Title>
        <Card.Text> Explora la majestuosa Patagonia con nuestras rutas de senderismo. Tenemos la aventura perfecta para ti.</Card.Text>
    </Card.Body>
</Card>

<Card className="card-home">
    <Card.Img variant="top" src="src/assets/img/estadosunidos.jpg"/>
    <Card.Body>
        <Card.Title>Paquete a Estados Unidos </Card.Title>
        <Card.Text> Viaja a Estados Unidos con nuestros paquetes turísticos. Desde las luces de Nueva York hasta la belleza natural del Gran Cañón.</Card.Text>
    </Card.Body>
</Card>

<Card className="card-home">
    <Card.Img variant="top" src="src/assets/img/kawaii.jpg"/>
    <Card.Body>
        <Card.Title>Buceo por Kawaii</Card.Title>
        <Card.Text> Sumérgete en las aguas cristalinas de Hawaii con nuestras inmersiones de buceo. Desde Three Fingers en Kauai hasta el Carthaginian II en Maui, descubre un mundo submarino fascinante.</Card.Text>
    </Card.Body>
</Card>
</div>
    );
  }
  
  export default Home;
  