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
  FiArrowUp,
  FiTrash2
} from "react-icons/fi";
import AddNewsForm from "../components/AddNewsForm";
import NewsModal from "../components/NewsModal";
import LoginForm from '../components/LoginForm.jsx';
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
  const [news, setNews] = useState([]);
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showDisciplinesModal, setShowDisciplinesModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загружаем данные пользователя при монтировании компонента
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Загружаем новости
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/news');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке новостей');
        }
        const data = await response.json();
        // Удаляем дубликаты по id
        const uniqueNews = data.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setNews(uniqueNews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Обновляем состояние пользователя в Header
    const header = document.querySelector('header');
    if (header) {
      const event = new CustomEvent('userLoggedIn', { detail: userData });
      header.dispatchEvent(event);
    }
  };

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

  const handleAddNews = async (newNews) => {
    try {
      // После успешного добавления загружаем свежий список новостей
      const newsResponse = await fetch('http://localhost:5001/api/news');
      if (!newsResponse.ok) {
        throw new Error('Ошибка при загрузке новостей');
      }
      const newsData = await newsResponse.json();
      setNews(newsData);
      setShowAddNewsForm(false);
    } catch (err) {
      setError(err.message);
    }
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

  const handleDeleteNews = async (newsId, e) => {
    if (e) {
      e.stopPropagation(); // Предотвращаем открытие модального окна новости
    }
    
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении новости');
      }

      setNews(prev => prev.filter(item => item.id !== newsId));
      if (selectedNews && selectedNews.id === newsId) {
        setSelectedNews(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditNews = (news) => {
    setEditingNews(news);
    setSelectedNews(null);
  };

  const handleUpdateNews = async (updatedNews) => {
    try {
      // Загружаем свежий список новостей
      const response = await fetch('http://localhost:5001/api/news');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке новостей');
      }
      const newsData = await response.json();
      setNews(newsData);
      setEditingNews(null);
    } catch (err) {
      setError(err.message);
    }
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
            {user && user.role === 'admin' && (
              <button 
                className={styles.addNewsButton}
                onClick={() => setShowAddNewsForm(true)}
              >
                <FiPlus /> Добавить новость
              </button>
            )}
          </div>
          {loading ? (
            <div className={styles.loading}>Загрузка новостей...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.newsGrid}>
              {news.map((item) => (
                <div 
                  key={item.id} 
                  className={styles.newsCard}
                  onClick={() => handleNewsClick(item)}
                >
                  {item.image_url && (
                    <div className={styles.newsImageContainer}>
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className={styles.newsImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/default-news.jpg';
                        }}
                      />
                    </div>
                  )}
                  <div className={styles.newsContent}>
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                    <p className={styles.newsDescription}>{item.description}</p>
                    <div className={styles.newsMeta}>
                      <div className={styles.newsMetaLeft}>
                        <span className={styles.newsDate}>
                          {new Date(item.created_at).toLocaleDateString('ru-RU')}
                        </span>
                        {item.author_name && (
                          <span className={styles.newsAuthor}>
                            Автор: {item.author_name}
                          </span>
                        )}
                      </div>
                      {user && user.role === 'admin' && (
                        <button 
                          className={styles.deleteNewsButton}
                          onClick={(e) => handleDeleteNews(item.id, e)}
                        >
                          <FiTrash2 /> Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />

      {/* Модальные окна */}
      {showAddNewsForm && (
        <AddNewsForm 
          onClose={() => setShowAddNewsForm(false)}
          onAddNews={handleAddNews}
        />
      )}

      {editingNews && (
        <AddNewsForm 
          onClose={() => setEditingNews(null)}
          onAddNews={handleUpdateNews}
          initialData={editingNews}
          isEditing={true}
        />
      )}

      {selectedNews && (
        <NewsModal 
          news={selectedNews}
          onClose={handleCloseNewsModal}
          onDelete={handleDeleteNews}
          onEdit={handleEditNews}
          isAdmin={user && user.role === 'admin'}
        />
      )}

      {showDisciplinesModal && (
        <DisciplinesModal 
          onClose={() => setShowDisciplinesModal(false)}
          disciplines={disciplines}
        />
      )}

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

export default MainPage;