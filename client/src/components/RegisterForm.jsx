import React, { useState } from 'react';
import styles from '../styles/AuthForms.module.css';
import { FiX, FiMail, FiLock, FiUser } from 'react-icons/fi';

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    // TODO: Добавить логику регистрации
    console.log('Register data:', formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        <h2>Регистрация</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Имя пользователя</label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Введите имя пользователя"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите ваш email"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторите пароль"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Зарегистрироваться
          </button>
        </form>

        <div className={styles.switchForm}>
          <p>Уже есть аккаунт?</p>
          <button onClick={onSwitchToLogin} className={styles.switchButton}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 