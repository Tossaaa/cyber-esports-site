import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/MainPage.module.css";
import logo from "../assets/logo.png";
import { 
  FiSearch, 
  FiUser, 
  FiLogIn, 
  FiArrowRight, 
  FiPlus,
  FiMenu,
  FiX,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiArrowUp
} from "react-icons/fi";
import AddNewsForm from "../components/AddNewsForm";
import NewsModal from "../components/NewsModal";
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import DisciplinesModal from '../components/DisciplinesModal';
import Header from '../components/Header';
import Footer from '../components/Footer';

const disciplines = [
  { id: "cs2", name: "CS2", image: "/images/cs2.jpg", bgColor: "#2a475e" },
  { id: "dota", name: "Dota 2", image: "/images/dota2.jpg", bgColor: "#1e3d6b" },
  { id: "pubg", name: "PUBG", image: "/images/pubg.jpg", bgColor: "#3a5a78" },
  { id: "valorant", name: "Valorant", image: "/images/valorant.jpg", bgColor: "#fa4454" },
];

const initialNews = [
  { 
    title: "Обновление в CS2", 
    description: "Valve выпустили новый патч с картами и балансом оружия", 
    date: "2 часа назад"
  },
  { 
    title: "TI 2025 объявлен", 
    description: "The International по Dota 2 пройдет в октябре в Стокгольме", 
    date: "Вчера"
  },
];

const MainPage = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const location = useLocation();
  const [news, setNews] = useState(initialNews);
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showDisciplinesModal, setShowDisciplinesModal] = useState(false);

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

  const handleAddNews = (newNews) => {
    setNews(prev => [newNews, ...prev]);
    setShowAddNewsForm(false);
  };

  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseNewsModal = () => {
    setSelectedNews(null);
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
    <div className={styles.wrapper}>
      <Header 
        onLoginClick={() => setShowLoginForm(true)}
        onRegisterClick={() => setShowRegisterForm(true)}
      />

      {/* Основной контент */}
      <div className={styles.container}>
        {/* Герой-секция */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Киберспортивная платформа</h1>
            <p>Участвуйте в турнирах, следите за матчами и развивайтесь в киберспорте</p>
            <button 
              className={styles.heroButton}
              onClick={() => setShowDisciplinesModal(true)}
            >
              Ближайшие турниры <FiArrowRight />
            </button>
          </div>
        </section>

        {/* Карточки дисциплин */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Популярные дисциплины</h2>
            <button 
              onClick={() => setShowDisciplinesModal(true)} 
              className={styles.viewAll}
            >
              Все дисциплины <FiArrowRight />
            </button>
          </div>
          <div className={styles.disciplinesGrid}>
            {disciplines.slice(0, 4).map((discipline) => (
              <Link 
                key={discipline.id} 
                to={`/discipline/${discipline.id}`} 
                className={styles.disciplineCard}
                style={{ '--card-bg': discipline.bgColor }}
              >
                <div className={styles.cardImageContainer}>
                  <img src={discipline.image} alt={discipline.name} className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{discipline.name}</h3>
                  <div className={styles.cardMeta}>
                    <span>12 активных турниров</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Новости */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Последние новости</h2>
            <div className={styles.sectionActions}>
              <button 
                className={styles.addNewsButton}
                onClick={() => setShowAddNewsForm(true)}
              >
                <FiPlus /> Добавить новость
              </button>
              <Link to="/news" className={styles.viewAll}>
                Все новости <FiArrowRight />
              </Link>
            </div>
          </div>
          <div className={styles.newsGrid}>
            {news.map((item, index) => (
              <div 
                key={index} 
                className={styles.newsCard}
                onClick={() => handleNewsClick(item)}
              >
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsDescription}>{item.description}</p>
                <span className={styles.newsDate}>{item.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />

      {/* Модальные окна */}
      {showAddNewsForm && (
        <AddNewsForm 
          onClose={() => setShowAddNewsForm(false)}
          onAdd={handleAddNews}
        />
      )}

      {selectedNews && (
        <NewsModal 
          news={selectedNews}
          onClose={handleCloseNewsModal}
        />
      )}

      {showLoginForm && (
        <LoginForm 
          onClose={() => setShowLoginForm(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {showRegisterForm && (
        <RegisterForm 
          onClose={() => setShowRegisterForm(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {showDisciplinesModal && (
        <DisciplinesModal 
          disciplines={disciplines}
          onClose={() => setShowDisciplinesModal(false)}
        />
      )}
    </div>
  );
};

export default MainPage;