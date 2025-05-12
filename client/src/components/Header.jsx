import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { FiSearch, FiUser, FiLogIn, FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="Cyber Esports" />
          </Link>
          <nav className={`${styles.nav} ${showMobileMenu ? styles.active : ''}`}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowMobileMenu(false)}
            >
              <FiX />
            </button>
            <Link 
              to="/tournaments" 
              className={`${styles.navLink} ${location.pathname === '/tournaments' ? styles.active : ''}`}
            >
              Турниры
            </Link>
            <Link 
              to="/teams" 
              className={`${styles.navLink} ${location.pathname === '/teams' ? styles.active : ''}`}
            >
              Команды
            </Link>
            <Link 
              to="/stats" 
              className={`${styles.navLink} ${location.pathname === '/stats' ? styles.active : ''}`}
            >
              Статистика
            </Link>
          </nav>
        </div>
        
        <div className={styles.headerRight}>
          <div className={`${styles.searchContainer} ${searchFocused ? styles.focused : ''}`}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Поиск турниров, команд..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={handleSearchBlur}
            />
            {showSearchResults && (
              <div className={styles.searchResults}>
                <div className={styles.searchResultItem}>
                  <FiSearch />
                  <span>Турнир: ESL Pro League Season 19</span>
                </div>
                <div className={styles.searchResultItem}>
                  <FiSearch />
                  <span>Команда: Natus Vincere</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.authButtons}>
            <button 
              className={`${styles.loginButton}`}
              onClick={onLoginClick}
            >
              <FiLogIn /> Войти
            </button>
            <button 
              className={`${styles.registerButton}`}
              onClick={onRegisterClick}
            >
              <FiUser /> Регистрация
            </button>
          </div>

          <button 
            className={styles.mobileMenuButton}
            onClick={() => setShowMobileMenu(true)}
          >
            <FiMenu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 