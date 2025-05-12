import React from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import styles from '../styles/DisciplinesModal.module.css';

const disciplines = [
  { 
    id: "cs2", 
    name: "CS2", 
    image: "/images/cs2.jpg", 
    bgColor: "#2a475e",
    description: "Командный шутер от первого лица, где две команды сражаются за победу"
  },
  { 
    id: "dota", 
    name: "Dota 2", 
    image: "/images/dota2.jpg", 
    bgColor: "#1e3d6b",
    description: "Многопользовательская командная игра в жанре MOBA"
  },
  { 
    id: "pubg", 
    name: "PUBG", 
    image: "/images/pubg.jpg", 
    bgColor: "#3a5a78",
    description: "Королевская битва, где последний выживший побеждает"
  },
  { 
    id: "valorant", 
    name: "Valorant", 
    image: "/images/valorant.jpg", 
    bgColor: "#fa4454",
    description: "Тактический шутер от первого лица с уникальными способностями"
  },
  { 
    id: "lol", 
    name: "League of Legends", 
    image: "/images/lol.jpg", 
    bgColor: "#0bc6e3",
    description: "Популярная MOBA игра с уникальными чемпионами"
  },
  { 
    id: "overwatch", 
    name: "Overwatch 2", 
    image: "/images/overwatch.jpg", 
    bgColor: "#ff9c41",
    description: "Командный шутер с уникальными героями и способностями"
  },
  { 
    id: "rainbow", 
    name: "Rainbow Six Siege", 
    image: "/images/rainbow.jpg", 
    bgColor: "#2a2a2a",
    description: "Тактический шутер с акцентом на разрушаемость окружения"
  },
  { 
    id: "apex", 
    name: "Apex Legends", 
    image: "/images/apex.jpg", 
    bgColor: "#da2929",
    description: "Королевская битва с уникальными персонажами и способностями"
  }
];

const DisciplinesModal = ({ onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        <h2 className={styles.title}>Все дисциплины</h2>
        
        <div className={styles.disciplinesGrid}>
          {disciplines.map((discipline) => (
            <Link 
              key={discipline.id} 
              to={`/discipline/${discipline.id}`} 
              className={styles.disciplineCard}
              style={{ '--card-bg': discipline.bgColor }}
              onClick={onClose}
            >
              <div className={styles.cardImageContainer}>
                <img src={discipline.image} alt={discipline.name} className={styles.cardImage} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{discipline.name}</h3>
                <p className={styles.cardDescription}>{discipline.description}</p>
                <div className={styles.cardMeta}>
                  <span>12 активных турниров</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisciplinesModal; 