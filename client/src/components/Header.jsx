import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { FiUser, FiLogIn, FiPlus, FiMenu, FiX, FiLogOut, FiTool } from 'react-icons/fi';
import InDevelopmentModal from './InDevelopmentModal';
import logo from '../assets/logo.png';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devSection, setDevSection] = useState('');
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handleDevClick = (section) => {
    setDevSection(section);
    setShowDevModal(true);
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
              <Link to="/news" className={`${styles.navLink} ${location.pathname === '/news' ? styles.active : ''}`}>
                Новости
              </Link>
              <Link to="/tournaments" className={`${styles.navLink} ${location.pathname === '/tournaments' ? styles.active : ''}`}>
                Турниры
              </Link>
              <button 
                className={styles.navLink} 
                onClick={() => handleDevClick('Команды')}
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
                <button className={styles.login} onClick={onLoginClick}>
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
    </>
  );
};

export default Header; 