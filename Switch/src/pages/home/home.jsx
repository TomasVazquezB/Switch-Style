import React from 'react';
import "./home.css";
import Card from 'react-bootstrap/Card';

const Home = () => {
  return (
      <div className="home-index"> 

    <h2 className='mas-buscasdo'>Descubre lo mas buscasdo</h2>

    <h2 className='ultimas-prendas'>Ultimas prendas añadidas</h2>
    <Card className="card-home">
    <Card.Img variant="top" src=""/>
    <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text> </Card.Text>
    </Card.Body>
</Card>

<Card className="card-home">
    <Card.Img variant="top" src=""/>
    <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text> </Card.Text>
    </Card.Body>
</Card>

<Card className="card-home">
    <Card.Img variant="top" src=""/>
    <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text> </Card.Text>
    </Card.Body>
</Card>

<Card className="card-home">
    <Card.Img variant="top" src=""/>
    <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text> </Card.Text>
    </Card.Body>
</Card>
</div>
    );
  }
  
  export default Home;
  