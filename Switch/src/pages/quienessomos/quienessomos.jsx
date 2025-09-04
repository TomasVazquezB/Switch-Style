import React, { useEffect } from 'react';
import './quienessomos.css';

export function QuienesSomosPage({ darkMode }) {
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="container-quienessomos">
      <div className="content">
        <h1 className="quienessomos"style={{ color: darkMode ? "#ffffffff" : "#000000ff" }}>¿Quiénes Somos?</h1>
        <p className="info"style={{ color: darkMode ? "#ffffffff" : "#000000ff" }}>Somos un equipo apasionado por innovar y crear soluciones que mejoren el mundo. Descubre al equipo que está detrás de esta visión</p>
        <div className="team-cards">
          <div className="team-card">
            <img src="src/assets/Tomas.jpg" alt="Tomas Vazquez Brouver" className="team-img" />
            <h3 className="team-name"style={{ color: darkMode ? "#ffffff" : "#111111" }}>Tomas Vazquez Brouver</h3>
            <p className="team-role">Fundador</p>
          </div>
          <div className="team-card">
            <img src="src/assets/Joaquin.jpg" alt="Joaquin Cardozo" className="team-img" />
            <h3 className="team-name"style={{ color: darkMode ? "#ffffff" : "#111111" }}>Joaquin Cardozo</h3>
            <p className="team-role">Cofundador</p>
          </div>
          <div className="team-card">
            <img src="src/assets/.jpg" alt="Carolina Ho" className="team-img" />
            <h3 className="team-name"style={{ color: darkMode ? "#ffffff" : "#111111" }}>Carolina Belen Ho</h3>
            <p className="team-role">Programadora y Diseñadora</p>
          </div>
        </div>
      </div>
    </div>
  );
}