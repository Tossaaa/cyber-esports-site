import React from 'react';
import styles from '../styles/NewsModal.module.css';
import { FiX } from 'react-icons/fi';

const NewsModal = ({ news, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        {news.image && (
          <div className={styles.imageContainer}>
            <img src={news.image} alt={news.title} className={styles.image} />
          </div>
        )}
        
        <div className={styles.content}>
          <span className={styles.date}>{news.date}</span>
          <h2 className={styles.title}>{news.title}</h2>
          <p className={styles.description}>{news.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsModal; 