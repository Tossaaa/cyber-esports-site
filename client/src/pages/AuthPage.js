import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuthSuccess = (user) => {
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(user));
        // Перенаправляем на главную страницу
        navigate('/');
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {isLogin ? (
                    <>
                        <LoginForm onSuccess={handleAuthSuccess} />
                        <p className="auth-switch">
                            Нет аккаунта?{' '}
                            <button
                                className="link-button"
                                onClick={() => setIsLogin(false)}
                            >
                                Зарегистрироваться
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <RegisterForm onSuccess={handleAuthSuccess} />
                        <p className="auth-switch">
                            Уже есть аккаунт?{' '}
                            <button
                                className="link-button"
                                onClick={() => setIsLogin(true)}
                            >
                                Войти
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPage; 