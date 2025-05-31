import React from 'react';
import { FiX, FiLogIn } from 'react-icons/fi';
import styles from '../styles/AuthRequiredModal.module.css';

const AuthRequiredModal = ({ onClose, onLoginClick }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        <div className={styles.content}>
          <h2>Требуется авторизация</h2>
          <p>Для просмотра подробной информации необходимо войти в систему или зарегистрироваться.</p>
          <button className={styles.loginButton} onClick={onLoginClick}>
            <FiLogIn /> Войти в систему
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal; 