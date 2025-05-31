import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import './Layout.css';

const Layout = ({ children }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLoginSuccess = (userData, token) => {
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
    <div className="layout">
      <Header 
        onLoginClick={() => setShowLoginForm(true)}
        onRegisterClick={() => setShowRegisterForm(true)}
      />
      <main className="main-content">
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