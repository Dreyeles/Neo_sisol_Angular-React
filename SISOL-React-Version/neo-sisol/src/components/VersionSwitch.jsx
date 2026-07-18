import React, { useEffect, useState } from 'react';
import './VersionSwitch.css';

const VersionSwitch = () => {
  const [angularUrl, setAngularUrl] = useState('https://neo-sisol-angular.vercel.app');
  const [landingUrl, setLandingUrl] = useState('/');

  useEffect(() => {
    const host = window.location.host;
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      setAngularUrl('http://localhost:4200');
      setLandingUrl('http://localhost:8080'); // Se asume que el root index.html se sirve en 8080 o similar
    }
  }, []);

  return (
    <div className="version-switch-container">
      <a href={angularUrl} className="switch-btn angular-btn">
        <span className="icon">🅰️</span>
        <span className="text">Cambiar a Angular</span>
      </a>
      <a href={landingUrl} className="switch-btn home-btn" title="Volver al Inicio">
        <span className="icon">🏠</span>
      </a>
    </div>
  );
};

export default VersionSwitch;
