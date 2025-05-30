import React from 'react';
import styles from '../styles/InDevelopmentModal.module.css';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const InDevelopmentModal = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        <div className={styles.modalContent}>
          <div className={styles.iconContainer}>
            <FiAlertCircle className={styles.icon} />
          </div>
          <h2>Функция в разработке</h2>
          <p>Данная функция находится в разработке и будет доступна в ближайшее время.</p>
          <button className={styles.okButton} onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default InDevelopmentModal; 