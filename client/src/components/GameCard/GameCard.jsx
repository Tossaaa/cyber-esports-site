import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ id, name, image, bgColor, activeTournaments }) => {
  return (
    <Link 
      to={`/discipline/${id}`} 
      className="game-card"
      style={{ '--card-bg': bgColor }}
    >
      <div className="card-image-container">
        <img src={image} alt={name} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <div className="card-meta">
          <span>{activeTournaments} активных турниров</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard; 