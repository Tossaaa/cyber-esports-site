import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, register } = useAuth();

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

        try {
            if (isLogin) {
                const data = await login(formData.email, formData.password);
                navigate('/');
            } else {
                const data = await register(formData);
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>
                        {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
                    </h1>
                    <p className={styles.authSubtitle}>
                        {isLogin 
                            ? 'Войдите, чтобы получить доступ к своему аккаунту'
                            : 'Создайте аккаунт, чтобы начать использовать все возможности'}
                    </p>
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

                    {!isLogin && (
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
                    )}

                    <div className={styles.formGroup}>
                        <label>Пароль</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Введите пароль"
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label>Подтвердите пароль</label>
                            <div className={styles.inputWrapper}>
                                <FiLock className={styles.inputIcon} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Подтвердите пароль"
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className={styles.submitButton}>
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className={styles.authSwitch}>
                    {isLogin ? (
                        <>
                            Нет аккаунта?{' '}
                            <button
                                className={styles.linkButton}
                                onClick={() => setIsLogin(false)}
                            >
                                Зарегистрироваться
                            </button>
                        </>
                    ) : (
                        <>
                            Уже есть аккаунт?{' '}
                            <button
                                className={styles.linkButton}
                                onClick={() => setIsLogin(true)}
                            >
                                Войти
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage; 