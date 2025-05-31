import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

const Layout = ({ children }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLoginSuccess = (userData, token) => {
    // Сохраняем данные пользователя и токен
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    // Генерируем событие userLoggedIn
    const event = new CustomEvent('userLoggedIn', { detail: userData });
    window.dispatchEvent(event);
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        onLoginClick={() => setShowLoginForm(true)}
        onRegisterClick={() => setShowRegisterForm(true)}
      />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />

      {/* Модальное окно входа */}
      {showLoginForm && (
        <LoginForm 
          onClose={() => setShowLoginForm(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Модальное окно регистрации */}
      {showRegisterForm && (
        <RegisterForm 
          onClose={() => setShowRegisterForm(false)}
          onSwitchToLogin={handleSwitchToLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Layout; 