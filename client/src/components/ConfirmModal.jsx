import React from 'react';
import styles from '../styles/MainPage.module.css';
import { FiX } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        <h2>{title}</h2>
        <p className={styles.confirmMessage}>{message}</p>
        
        <div className={styles.confirmButtons}>
          <button 
            className={`${styles.submitButton} ${styles.cancelButton}`} 
            onClick={onClose}
          >
            Отмена
          </button>
          <button 
            className={`${styles.submitButton} ${styles.confirmButton}`} 
            onClick={onConfirm}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 