import React, { useState } from 'react';
import styles from '../styles/AuthForms.module.css';
import { FiX, FiMail, FiLock } from 'react-icons/fi';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    // TODO: Добавить логику входа
    console.log('Login data:', formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        <h2>Вход в аккаунт</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
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
                placeholder="Введите ваш пароль"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Войти
          </button>
        </form>

        <div className={styles.switchForm}>
          <p>Нет аккаунта?</p>
          <button onClick={onSwitchToRegister} className={styles.switchButton}>
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 