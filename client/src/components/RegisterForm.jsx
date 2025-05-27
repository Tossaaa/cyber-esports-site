import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AuthModal.module.css';
import { FiX, FiLock, FiUser, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../api/auth';

const RegisterForm = ({ onClose, onSwitchToLogin, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Минимум 8 символов, минимум одна буква и одна цифра
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };

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

    if (!validateEmail(formData.email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Пароль должен содержать минимум 8 символов, включая буквы и цифры');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      if (response.success) {
        onLoginSuccess(response.user, response.token);
        onClose();
      } else {
        setError(response.message || 'Ошибка при регистрации');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при регистрации');
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
          <h2 className={styles.modalTitle}>Регистрация</h2>
          <p className={styles.modalSubtitle}>Создайте аккаунт, чтобы начать использовать все возможности</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Имя пользователя</label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Введите имя пользователя"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Введите email"
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

          <div className={styles.formGroup}>
            <label>Подтвердите пароль</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Подтвердите пароль"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.modalSwitch}>
          Уже есть аккаунт?{' '}
          <button
            className={styles.linkButton}
            onClick={onSwitchToLogin}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 