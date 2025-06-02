import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { FiUser, FiLogIn, FiPlus, FiMenu, FiX, FiLogOut, FiTool } from 'react-icons/fi';
import InDevelopmentModal from './InDevelopmentModal';
import ConfirmModal from './ConfirmModal';
import logo from '../assets/logo.png';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthRequiredModal from './AuthRequiredModal';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devSection, setDevSection] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleUserLoggedIn = (event) => {
      setUser(event.detail);
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);

    const handleAvatarUpdated = () => {
      setUser(prevUser => ({ ...prevUser }));
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdated);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('avatarUpdated', handleAvatarUpdated);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const handleDevClick = (section) => {
    setDevSection(section);
    setShowDevModal(true);
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setShowLoginForm(false);
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

  const handleNewsClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthRequired(true);
    }
  };

  const handleTournamentsClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthRequired(true);
    }
  };

  const handleTeamsClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthRequired(true);
      return;
    }
    handleDevClick('Команды');
  };

  return (
    <>
      <header className={`${styles.headerWrapper} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link to="/" className={styles.logo}>
              <img src={logo} alt="Cyber Esports" />
            </Link>
            <nav className={`${styles.nav} ${showMobileMenu ? styles.mobileMenuActive : ''}`}>
              <button className={styles.mobileMenuClose} onClick={() => setShowMobileMenu(false)}>
                <FiX />
              </button>
              <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
                Главная
              </Link>
              <Link to="/news" className={`${styles.navLink} ${location.pathname === '/news' ? styles.active : ''}`} onClick={handleNewsClick}>
                Новости
              </Link>
              <Link to="/tournaments" className={`${styles.navLink} ${location.pathname === '/tournaments' ? styles.active : ''}`} onClick={handleTournamentsClick}>
                Турниры
              </Link>
              <button 
                className={styles.navLink} 
                onClick={handleTeamsClick}
              >
                Команды
              </button>
            </nav>
          </div>

          <div className={styles.headerRight}>
            {user ? (
              <div className={styles.userMenu}>
                <Link to="/profile" className={styles.userInfo}>
                  <div 
                    className={styles.userAvatar}
                    style={{
                      backgroundImage: localStorage.getItem(`avatar_${user.id}`) 
                        ? `url(${localStorage.getItem(`avatar_${user.id}`)})`
                        : 'none'
                    }}
                  >
                    {!localStorage.getItem(`avatar_${user.id}`) && <FiUser />}
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.username}</span>
                    <span className={styles.userRole}>{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
                  </div>
                </Link>
                <button className={styles.logoutButton} onClick={handleLogout} title="Выйти">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className={styles.auth}>
                <button className={styles.login} onClick={() => setShowLoginForm(true)}>
                  <FiLogIn />
                  Войти
                </button>
                <button className={styles.register} onClick={onRegisterClick}>
                  <FiPlus />
                  Регистрация
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <InDevelopmentModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        section={devSection}
      />

      {showLoginForm && (
        <LoginForm 
          onClose={() => setShowLoginForm(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showRegisterForm && (
        <RegisterForm 
          onClose={() => setShowRegisterForm(false)}
          onSwitchToLogin={handleSwitchToLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showLogoutConfirm && (
        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Подтверждение выхода"
          message="Вы уверены, что хотите выйти из системы?"
        />
      )}

      {showAuthRequired && (
        <AuthRequiredModal 
          onClose={() => setShowAuthRequired(false)}
          onLoginClick={() => {
            setShowAuthRequired(false);
            setShowLoginForm(true);
          }}
        />
      )}
    </>
  );
};

export default Header; 