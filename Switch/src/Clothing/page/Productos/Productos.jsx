import './Productos.css'

export function Productos ({productos}){

    return (
        <main className='productos'>
            <ul>
                {productos.map(productos =>(
                    <li key={productos.id}>
                        <img src={productos.img} alt={productos.nombre}/>
                        
                        <div>
                            <h3>{productos.nombre}</h3>
                        </div>
                        <div>
                            <button>
                                
                            </button>
                        </div>
                    </li>
                )

                )}
            </ul>
        </main>

    )

}