import React, { useState } from 'react';
import { FiUser, FiX } from 'react-icons/fi';
import styles from '../styles/AuthModal.module.css';
import { authAPI } from '../api/auth';
import SuccessModal from './SuccessModal';

const ChangeNameForm = ({ onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    newUsername: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.changeUsername(formData);
      
      // Обновляем данные пользователя в localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, username: response.user.username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        onUpdateSuccess(response.user);
        onClose();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message || 'Ошибка при изменении имени пользователя. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>

          <div className={styles.modalContent}>
            <div className={styles.successIcon}>
              <FiUser />
            </div>
            <h2 className={styles.modalTitle}>Изменение имени пользователя</h2>
            <p className={styles.modalSubtitle}>
              Введите новое имя пользователя
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    name="newUsername"
                    value={formData.newUsername}
                    onChange={handleChange}
                    placeholder="Новое имя пользователя"
                    required
                    minLength={3}
                    maxLength={30}
                    className={styles.input}
                  />
                </div>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Изменение...' : 'Изменить имя'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal 
          message="Имя пользователя успешно изменено" 
        />
      )}
    </>
  );
};

export default ChangeNameForm; 