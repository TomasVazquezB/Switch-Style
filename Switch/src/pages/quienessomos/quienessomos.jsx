import React from 'react';
import './quienessomos.css';

export function QuienesSomosPage() {
    return (
        <div className="container-quienessomos">
            <div className="content">
                <div className="header">
                    <h1 className="quienessomos">¿Quiénes Somos?</h1>
                </div>
                <div className="info-container">
                    <p className="info">
                    
                    </p>
                </div>
                <div className="team-cards">
                    <div className="team-card">
                        <img src="" alt="Team Member" className="team-img" />
                        <h3 className="team-name">Tomas Vazquez Brouver</h3>
                        <p className="team-role">Fundador</p>
                    </div>
                    <div className="team-card">
                        <img src="" alt="Team Member" className="team-img" />
                        <h3 className="team-name">Joaquin Cardozo</h3>
                        <p className="team-role">Cofundador</p>
                    </div>
                    <div className="team-card">
                        <img src="" alt="Team Member" className="team-img" />
                        <h3 className="team-name">Carolina Belen Ho</h3>
                        <p className="team-role">Diseñadora</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
