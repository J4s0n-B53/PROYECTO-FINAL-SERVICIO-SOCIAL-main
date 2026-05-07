import { useState, useEffect } from 'react';

const ListaOfertas = ({ carreraId }) => { 
    const [ofertas, setOfertas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Intentar obtener el ID de la carrera si no viene por prop
        const idParaFiltrar = carreraId || localStorage.getItem('id_carrera');
        
        // Si hay un ID, filtramos; si no, pedimos todas
        const url = idParaFiltrar 
            ? `http://localhost:3000/api/ofertas?carreraId=${idParaFiltrar}`
            : `http://localhost:3000/api/ofertas`;

        console.log("Pidiendo ofertas a:", url);

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setOfertas(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setCargando(false);
            });
    }, [carreraId]);

    if (cargando) return <div className="mensaje">Cargando ofertas de la USO...</div>;

    return (
        <div className="ofertas-container">
            {ofertas.length > 0 ? (
                ofertas.map(oferta => (
                    <div key={oferta.id_oferta} className="card">
                        {/* Verificamos si hay imagen, si no ponemos una por defecto */}
                        <img src={oferta.imagen_url || 'https://via.placeholder.com/300x150'} alt={oferta.titulo} />
                        <h3>{oferta.titulo}</h3>
                        <p>{oferta.descripcion}</p>
                        <div className="info-extra">
                            <span>📍 {oferta.ubicacion}</span>
                            <span>👥 Cupos: {oferta.cupo_actual}/{oferta.cupo_maximo}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="mensaje">No hay ofertas disponibles para mostrar.</div>
            )}
        </div>
    );
};

export default ListaOfertas;