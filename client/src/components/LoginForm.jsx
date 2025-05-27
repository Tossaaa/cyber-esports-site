import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AuthModal.module.css';
import { FiX, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../api/auth';

const LoginForm = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      if (response.success) {
        onLoginSuccess(response.user, response.token);
        onClose();
      } else {
        setError(response.message || 'Ошибка при входе');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Вход в аккаунт</h2>
          <p className={styles.modalSubtitle}>Войдите, чтобы получить доступ к своему аккаунту</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email или имя пользователя</label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Введите email или имя пользователя"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Пароль</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Введите пароль"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className={styles.modalSwitch}>
          Нет аккаунта?{' '}
          <button
            className={styles.linkButton}
            onClick={onSwitchToRegister}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 