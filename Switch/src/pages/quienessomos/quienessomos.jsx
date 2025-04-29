import React from 'react';
import './quienessomos.css';

export function QuienesSomosPage() {
    return (
        <div className="container-quienessomos">
            <div className="content">
                <h1 className="quienessomos">¿Quiénes Somos?</h1>
                <p className="info">Un equipo apasionado por innovar y crear soluciones que mejoren el mundo Descubre al equipo que está detrás de esta visión</p>
                <div className="team-cards">
                    <div className="team-card">
                        <img src="src/assets/Tomas.jpg" alt="Team Member" className="team-img"/>
                        <h3 className="team-name">Tomas Vazquez Brouver</h3>
                        <p className="team-role">Fundador</p>
                    </div>
                    <div className="team-card">
                    <img src="src/assets/.jpg" alt="Team Member" className="team-img"/>
                        <h3 className="team-name">Joaquin Cardozo</h3>
                        <p className="team-role">Cofundador</p>
                    </div>
                    <div className="team-card">
                    <img src="src/assets/.jpg" alt="Team Member" className="team-img"/>
                        <h3 className="team-name">Carolina Belen Ho</h3>
                        <p className="team-role">Programadora y Diseñadora</p>
                    </div>
                </div>
            </div>
        </div>
    );
}