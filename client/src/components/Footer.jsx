import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiArrowUp } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <Link to="/" className={styles.footerLogo}>
            <img src={logo} alt="Cyber Esports" />
          </Link>
          <p className={styles.footerDescription}>
            Крупнейшая платформа для киберспортивных турниров и соревнований. 
            Присоединяйтесь к сообществу и станьте частью киберспортивной истории.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FiFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FiTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FiInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FiYoutube />
            </a>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <div className={styles.linksColumn}>
            <h3 className={styles.linksTitle}>Разделы</h3>
            <ul className={styles.linksList}>
              <li><Link to="/tournaments" className={styles.footerLink}>Турниры</Link></li>
              <li><Link to="/teams" className={styles.footerLink}>Команды</Link></li>
              <li><Link to="/statistics" className={styles.footerLink}>Статистика</Link></li>
              <li><Link to="/news" className={styles.footerLink}>Новости</Link></li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h3 className={styles.linksTitle}>Поддержка</h3>
            <ul className={styles.linksList}>
              <li><Link to="/faq" className={styles.footerLink}>FAQ</Link></li>
              <li><Link to="/contact" className={styles.footerLink}>Контакты</Link></li>
              <li><Link to="/rules" className={styles.footerLink}>Правила</Link></li>
              <li><Link to="/privacy" className={styles.footerLink}>Конфиденциальность</Link></li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h3 className={styles.linksTitle}>Подписка</h3>
            <p className={styles.subscribeText}>Будьте в курсе всех событий</p>
            <form className={styles.subscribeForm}>
              <input 
                type="email" 
                placeholder="Ваш email" 
                className={styles.subscribeInput}
              />
              <button type="submit" className={styles.subscribeButton}>
                Подписаться
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © 2024 Cyber Esports. Все права защищены.
        </p>
        <button 
          className={styles.scrollToTop}
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <FiArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer; 