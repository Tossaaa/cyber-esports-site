import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <Link to="/" className="footer-logo">
            <img src="/logo.png" alt="Логотип" />
          </Link>
          <p className="footer-description">
            Киберспортивная платформа для отслеживания турниров и статистики
          </p>
        </div>
        <div className="footer-links">
          <div className="links-column">
            <h4 className="links-title">Разделы</h4>
            <nav className="links-list">
              <Link to="/tournaments" className="footer-link">Турниры</Link>
              <Link to="/teams" className="footer-link">Команды</Link>
              <Link to="/stats" className="footer-link">Статистика</Link>
              <Link to="/news" className="footer-link">Новости</Link>
            </nav>
          </div>
          <div className="links-column">
            <h4 className="links-title">Поддержка</h4>
            <nav className="links-list">
              <Link to="/help" className="footer-link">Помощь</Link>
              <Link to="/faq" className="footer-link">FAQ</Link>
              <Link to="/contact" className="footer-link">Контакты</Link>
              <Link to="/privacy" className="footer-link">Политика</Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">
          © 2025 Esports Platform. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 