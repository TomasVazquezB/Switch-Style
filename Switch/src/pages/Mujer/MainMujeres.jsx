import React from "react";
import './MainMujeres.css';
import COAT from '../../assets/COAT.png';
import DRESS from '../../assets/DRESS.png';
import NECKLACE from '../../assets/NECKLACE.png';
import PANTS from '../../assets/PANTS.png';
import RING from '../../assets/RING.png';
import SANDALS from '../../assets/SANDALS.png';
import SHIRT from '../../assets/SHIRT.png';
import TSHIRT from '../../assets/TSHIRT.png';

const MainMujeresPage = () => {

    return (
        <div className="content">
        <section className="sidebar">
                <div class="sidebar-content">

                    <h2 class="border-bottom filter-title">TALLA</h2>
                    <input type="checkbox" class="custom-control-input" id="Small" />
                    <label class="custom-control-label" for="Small">SMALL</label>
                    <br></br>

                    <input type="checkbox" class="custom-control-input" id="Medium" />
                    <label class="custom-control-label" for="Medium">MEDIUM</label>
                    <br></br>

                    <input type="checkbox" class="custom-control-input" id="Large" />
                    <label class="custom-control-label" for="Large">LARGE</label>
                    <br></br>

                    <input type="checkbox" class="custom-control-input" id="XLarge" />
                    <label class="custom-control-label" for="XLarge">XLARGE</label>

                    <hr></hr>
                    <h2 class="border-bottom filter-title">CATEGORIA</h2>

                    <hr></hr>

                    <h2 class="font-xbold body-font border-bottom filter-title">PRECIO</h2>
                    <div class="range">
                    <input type="range"/>
                    </div>
                    <hr></hr>

                    <h2 class="border-bottom filter-title">CONDICION</h2>
                    <input type="checkbox" class="custom-control-input" id="Nuevo" />
                    <label class="custom-control-label" for="Nuevo">NUEVO</label>
                    <br></br>

                    <input type="checkbox" class="custom-control-input" id="Excelente" />
                    <label class="custom-control-label" for="Excelente">EXCELENTE</label>
                    <br></br>

                    <input type="checkbox" class="custom-control-input" id="MuyBien" />
                    <label class="custom-control-label" for="MuyBien">MUY BIEN</label>
                    <br></br>

                    <input type="checkbox" class="custom-control-input" id="Bien" />
                    <label class="custom-control-label" for="Bien">BIEN</label>
                    <hr></hr>

                    <h2 class="border-bottom filter-title">COLOR</h2>
                    <hr></hr>

                    <h2 class="border-bottom filter-title">MATERIAL</h2>
                </div>

            </section>
            <div class="main">
                <div class="row">
                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={COAT} alt="Coat" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                        <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>

                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={DRESS} alt="DRESS" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                        <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>

                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={NECKLACE} alt="NECKLACE" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                    <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>

                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={PANTS} alt="PANTS" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                        <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>

                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={RING} alt="RING" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                        <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>

                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={SANDALS} alt="SANDALS" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                        <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>

                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={SHIRT} alt="SHIRT" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                        <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>

                    <div class="column">
                        <section className="card-container">
                            <section className="card">
                                <img src={TSHIRT} alt="TSHIRT" />
                                <div className="card-details">
                                    <h3 className="card-title">TEST</h3>
                                    <strong>MARCA + TALLE</strong>
                                    <hr></hr>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                                <hr></hr>
                                <section className="card-price">
                                    <div className="precio">
                                        <h4><del>$50000</del> 34000</h4>
                                    </div>
                                    <br></br>
                                </section>
                            </section>
                        </section>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default MainMujeresPage