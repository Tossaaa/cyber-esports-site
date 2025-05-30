import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InDevelopmentModal from '../InDevelopmentModal';
import './GameCard.css';

const GameCard = ({ id, name, image, bgColor, activeTournaments }) => {
  const [showInDevelopmentModal, setShowInDevelopmentModal] = useState(false);

  const handleClick = (e) => {
    if (id !== 'cs2') {
      e.preventDefault();
      setShowInDevelopmentModal(true);
    }
  };

  return (
    <>
      <Link 
        to={`/discipline/${id}`} 
        className="game-card"
        style={{ '--card-bg': bgColor }}
        onClick={handleClick}
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

      {showInDevelopmentModal && (
        <InDevelopmentModal
          onClose={() => setShowInDevelopmentModal(false)}
        />
      )}
    </>
  );
};

export default GameCard; 