import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { FiSearch, FiUser, FiLogIn, FiPlus, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';
import logo from '../assets/logo.png';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Проверяем наличие данных пользователя в localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Добавляем слушатель события userLoggedIn
    const handleUserLoggedIn = (event) => {
      setUser(event.detail);
    };

    const header = document.querySelector('header');
    if (header) {
      header.addEventListener('userLoggedIn', handleUserLoggedIn);
    }

    return () => {
      if (header) {
        header.removeEventListener('userLoggedIn', handleUserLoggedIn);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
      setSearchFocused(false);
    }, 200);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowLogoutConfirm(false);
    window.location.href = '/';
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
              <Link to="/teams" className={`${styles.navLink} ${location.pathname === '/teams' ? styles.active : ''}`}>
                Команды
              </Link>
            </nav>
          </div>

          <div className={styles.headerRight}>
            <div className={`${styles.searchContainer} ${searchFocused ? styles.focused : ''}`}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                className={styles.search}
                placeholder="Поиск..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={handleSearchBlur}
              />
              {showSearchResults && (
                <div className={styles.searchResults}>
                  <div className={styles.searchResultItem}>
                    <FiSearch />
                    <span>Результат поиска 1</span>
                  </div>
                  <div className={styles.searchResultItem}>
                    <FiSearch />
                    <span>Результат поиска 2</span>
                  </div>
                </div>
              )}
            </div>

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
                <button className={styles.logoutButton} onClick={handleLogoutClick} title="Выйти">
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

            <button className={styles.mobileMenuButton} onClick={() => setShowMobileMenu(true)}>
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Подтверждение выхода"
        message="Вы уверены, что хотите выйти из аккаунта?"
      />
    </>
  );
};

export default Header; 