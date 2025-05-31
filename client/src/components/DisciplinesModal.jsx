import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import styles from '../styles/MainPage.module.css';
import InDevelopmentModal from './InDevelopmentModal';

const disciplines = [
  { 
    id: "cs2", 
    name: "CS2", 
    image: "/images/cs2.jpg", 
    bgColor: "#2a475e",
    description: "Командный шутер от первого лица, где две команды сражаются за победу",
    status: "active"
  },
  { 
    id: "dota", 
    name: "Dota 2", 
    image: "/images/dota2.jpg", 
    bgColor: "#1e3d6b",
    description: "Многопользовательская командная игра в жанре MOBA",
    status: "development"
  },
  { 
    id: "pubg", 
    name: "PUBG", 
    image: "/images/pubg.jpg", 
    bgColor: "#3a5a78",
    description: "Королевская битва, где последний выживший побеждает",
    status: "development"
  },
  { 
    id: "valorant", 
    name: "Valorant", 
    image: "/images/valorant.jpg", 
    bgColor: "#fa4454",
    description: "Тактический шутер от первого лица с уникальными способностями",
    status: "development"
  },
  { 
    id: "lol", 
    name: "League of Legends", 
    image: "/images/lol.jpg", 
    bgColor: "#0bc6e3",
    description: "Популярная MOBA игра с уникальными чемпионами",
    status: "development"
  },
  { 
    id: "overwatch", 
    name: "Overwatch 2", 
    image: "/images/overwatch.jpg", 
    bgColor: "#ff9c41",
    description: "Командный шутер с уникальными героями и способностями",
    status: "development"
  },
  { 
    id: "apex", 
    name: "Apex Legends", 
    image: "/images/apex.jpg", 
    bgColor: "#da2929",
    description: "Королевская битва с уникальными персонажами и способностями",
    status: "development"
  }
];

const DisciplinesModal = ({ onClose }) => {
  const [showDevModal, setShowDevModal] = useState(false);
  const [devSection, setDevSection] = useState('');

  const handleDevClick = (discipline) => {
    setDevSection(discipline.name);
    setShowDevModal(true);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        <h2>Все дисциплины</h2>
        
        <div className={styles.modalDisciplines}>
          <div className={styles.disciplinesSection}>
            <h3 className={styles.sectionSubtitle}>Активные дисциплины</h3>
            <div className={styles.modalDisciplinesGrid}>
              {disciplines.filter(d => d.status === "active").map((discipline) => (
                <Link
                  key={discipline.id}
                  to={`/discipline/${discipline.id}`}
                  className={styles.modalDisciplineCard}
                  style={{ '--card-bg': discipline.bgColor }}
                  onClick={onClose}
                >
                  <div className={styles.modalCardImageContainer}>
                    <img src={discipline.image} alt={discipline.name} />
                  </div>
                  <div className={styles.modalCardContent}>
                    <h4>{discipline.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.disciplinesSection}>
            <h3 className={styles.sectionSubtitle}>В разработке</h3>
            <div className={styles.modalDisciplinesGrid}>
              {disciplines.filter(d => d.status === "development").map((discipline) => (
                <div
                  key={discipline.id}
                  className={`${styles.modalDisciplineCard} ${styles.developmentCard}`}
                  style={{ '--card-bg': discipline.bgColor }}
                  onClick={() => handleDevClick(discipline)}
                >
                  <div className={styles.modalCardImageContainer}>
                    <img src={discipline.image} alt={discipline.name} />
                    <div className={styles.developmentOverlay}>
                      <span className={styles.developmentBadge}>В разработке</span>
                    </div>
                  </div>
                  <div className={styles.modalCardContent}>
                    <h4>{discipline.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InDevelopmentModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        section={devSection}
      />
    </div>
  );
};

export default DisciplinesModal; 