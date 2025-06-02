import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FiTrash2,
  FiCalendar,
  FiTag,
  FiLoader,
  FiAlertCircle,
  FiFileText
} from "react-icons/fi";
import AddNewsForm from "../components/AddNewsForm";
import NewsModal from "../components/NewsModal";
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm';
import DisciplinesModal from '../components/DisciplinesModal';
import InDevelopmentModal from '../components/InDevelopmentModal';
import AuthRequiredModal from '../components/AuthRequiredModal';
import { API_BASE_URL } from '../config';

const disciplines = [
  { id: "cs2", name: "CS2", image: "/images/cs2.jpg", bgColor: "#2a475e", status: "active" },
  { id: "dota", name: "Dota 2", image: "/images/dota2.jpg", bgColor: "#1e3d6b", status: "active" },
  { id: "valorant", name: "Valorant", image: "/images/valorant.jpg", bgColor: "#fa4454", status: "active" },
  { id: "pubg", name: "PUBG", image: "/images/pubg.jpg", bgColor: "#3a5a78", status: "active" },
  { id: "lol", name: "League of Legends", image: "/images/lol.jpg", bgColor: "#0AC8B9", status: "development" },
  { id: "fortnite", name: "Fortnite", image: "/images/fortnite.jpg", bgColor: "#7B68EE", status: "development" },
  { id: "apex", name: "Apex Legends", image: "/images/apex.jpg", bgColor: "#FF4655", status: "development" },
  { id: "overwatch", name: "Overwatch 2", image: "/images/overwatch.jpg", bgColor: "#FF9C41", status: "development" }
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

const gameTags = {
  cs2: 'CS2',
  dota: 'Dota 2',
  valorant: 'Valorant',
  pubg: 'PUBG',
  lol: 'League of Legends',
  fortnite: 'Fortnite',
  apex: 'Apex Legends',
  overwatch: 'Overwatch 2'
};

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
  const [showInDevelopmentModal, setShowInDevelopmentModal] = useState(false);
  const [devSection, setDevSection] = useState('');
  const navigate = useNavigate();
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  useEffect(() => {
    // Загружаем данные пользователя при монтировании компонента
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Добавляем обработчик события userLoggedIn
    const handleUserLoggedIn = (event) => {
      setUser(event.detail);
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);

    // Загружаем новости
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/news`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
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
        console.error('Ошибка при загрузке новостей:', err);
        setError(err.message || 'Не удалось загрузить новости. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Очищаем обработчик при размонтировании
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const handleLoginSuccess = (userData, token) => {
    // Генерируем событие userLoggedIn
    const event = new CustomEvent('userLoggedIn', { detail: userData });
    window.dispatchEvent(event);
    // Открываем модальное окно с дисциплинами после успешной авторизации
    setShowDisciplinesModal(true);
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
      // Загружаем свежий список новостей
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
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
      setShowAddNewsForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewsClick = (newsItem) => {
    if (!user) {
      setShowAuthRequired(true);
      return;
    }
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
      const response = await fetch(`${API_BASE_URL}/news/${newsId}`, {
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

  const handleUpdateNews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке новостей');
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDisciplineClick = (e, disciplineId) => {
    if (disciplineId !== "cs2") {
      e.preventDefault();
      const discipline = disciplines.find(d => d.id === disciplineId);
      setDevSection(discipline.name);
      setShowInDevelopmentModal(true);
    }
  };

  const handleViewAllDisciplines = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthRequired(true);
      return false;
    }
    return true;
  };

  const handleViewAllNews = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthRequired(true);
      return;
    }
  };

  const handleViewTournaments = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthRequired(true);
      return;
    }
    navigate('/tournaments');
  };

  return (
    <div className={styles.wrapper}>
      {/* Основной контент */}
      <div className={styles.container}>
        {/* Герой-секция */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Киберспорт - это больше чем игра</h1>
            <p>Присоединяйтесь к сообществу, участвуйте в турнирах и станьте частью киберспортивной истории</p>
            <button 
              className={styles.heroButton}
              onClick={handleViewTournaments}
            >
              Смотреть турниры <FiArrowRight />
            </button>
          </div>
        </section>

        {/* Карточки дисциплин */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Популярные дисциплины</h2>
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (handleViewAllDisciplines(e)) {
                  setShowDisciplinesModal(true);
                }
              }} 
              className={styles.viewAll}
            >
              Все дисциплины <FiArrowRight />
            </button>
          </div>
          <div className={styles.disciplinesGrid}>
            {disciplines.filter(d => d.status === "active").map((discipline) => (
              <Link 
                key={discipline.id} 
                to={`/discipline/${discipline.id}`} 
                className={styles.disciplineCard}
                style={{ '--card-bg': discipline.bgColor }}
                onClick={(e) => handleDisciplineClick(e, discipline.id)}
              >
                <div className={styles.cardImageContainer}>
                  <img src={discipline.image} alt={discipline.name} className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{discipline.name}</h3>
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
              {user && user.role === 'admin' && (
                <button 
                  className={styles.addNewsButton}
                  onClick={() => setShowAddNewsForm(true)}
                >
                  <FiPlus /> Добавить новость
                </button>
              )}
              <Link to="/news" className={styles.viewAll} onClick={handleViewAllNews}>
                Все новости <FiArrowRight />
              </Link>
            </div>
          </div>
          {loading ? (
            <div className={styles.loading}>Загрузка новостей...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.newsGrid}>
              {news.slice(0, 4).map((item) => (
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

      {showInDevelopmentModal && (
        <InDevelopmentModal
          isOpen={showInDevelopmentModal}
          onClose={() => {
            console.log('Closing modal');
            setShowInDevelopmentModal(false);
          }}
          section={devSection}
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
    </div>
  );
};

export default MainPage;