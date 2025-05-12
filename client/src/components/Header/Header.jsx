import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiLogIn } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Logo" />
          </Link>
          <nav className="nav">
            <Link to="/tournaments" className="nav-link">Турниры</Link>
            <Link to="/teams" className="nav-link">Команды</Link>
            <Link to="/stats" className="nav-link">Статистика</Link>
          </nav>
        </div>
        
        <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Поиск турниров, команд..." 
            className="search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <div className="auth-buttons">
          <button className="btn btn-login">
            <FiLogIn /> Войти
          </button>
          <button className="btn btn-register">
            <FiUser /> Регистрация
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 