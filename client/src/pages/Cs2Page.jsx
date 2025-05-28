import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/CS2Page.module.css';
import { FiStar, FiTarget, FiMap, FiUsers, FiAward, FiClock, FiCalendar, FiPlus, FiArrowRight, FiUser, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { FaUsers, FaTrophy, FaCrosshairs, FaMap, FaClock } from 'react-icons/fa';
import AddNewsForm from '../components/AddNewsForm';
import NewsModal from '../components/NewsModal';
import PlayerOfMonthForm from '../components/PlayerOfMonthForm';

const Cs2Page = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [user, setUser] = useState(null);
  const [playerOfMonth, setPlayerOfMonth] = useState(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(true);
  const [playerError, setPlayerError] = useState(null);

  useEffect(() => {
    // Загружаем данные пользователя при монтировании компонента
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем новости
        const newsResponse = await fetch('http://localhost:5001/api/news/tag/cs2');
        if (!newsResponse.ok) {
          throw new Error('Ошибка при загрузке новостей');
        }
        const newsData = await newsResponse.json();
        setNews(newsData);

        // Загружаем данные игрока месяца
        setLoadingPlayer(true);
        setPlayerError(null);
        const playerResponse = await fetch('http://localhost:5001/api/player-of-month/cs2');
        if (!playerResponse.ok) {
          throw new Error('Ошибка при загрузке данных игрока');
        }
        const playerData = await playerResponse.json();
        // Убедимся, что URL изображения полный
        if (playerData.image && !playerData.image.startsWith('http')) {
          playerData.image = `http://localhost:5001${playerData.image}`;
        }
        setPlayerOfMonth(playerData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setPlayerError(err.message);
      } finally {
        setLoading(false);
        setLoadingPlayer(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsClick = (item) => {
    setSelectedNews(item);
  };

  const handleCloseNewsModal = () => {
    setSelectedNews(null);
  };

  const handleDeleteNews = async (id, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении новости');
      }

      setNews(prev => prev.filter(item => item.id !== id));
      if (selectedNews && selectedNews.id === id) {
        setSelectedNews(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditNews = (item) => {
    setEditingNews(item);
    setSelectedNews(null);
  };

  const handleUpdateNews = async (updatedNews) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/news/${updatedNews._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedNews)
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении новости');
      }

      // Обновляем список новостей после успешного редактирования
      const newsResponse = await fetch('http://localhost:5001/api/news/tag/cs2');
      if (!newsResponse.ok) {
        throw new Error('Ошибка при загрузке новостей');
      }
      const newsData = await newsResponse.json();
      setNews(newsData);
      setEditingNews(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNews = async (newNews) => {
    try {
      // Обновляем список новостей с полученными данными
      setNews(prev => [newNews, ...prev]);
      setShowAddNewsForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSavePlayer = async (updatedPlayer) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходимо авторизоваться');
      }

      const response = await fetch(`http://localhost:5001/api/player-of-month/${playerOfMonth.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...updatedPlayer,
          game: 'cs2' // Добавляем игру, так как она не передается из формы
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при обновлении игрока месяца');
      }

      const data = await response.json();
      // Убедимся, что URL изображения полный
      if (data.image && !data.image.startsWith('http')) {
        data.image = `http://localhost:5001${data.image}`;
      }
      setPlayerOfMonth(data);
      setShowPlayerForm(false);
    } catch (err) {
      console.error('Error updating player:', err);
      setError(err.message);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'overview':
        scrollToSection('overview-section');
        break;
      case 'tournaments':
        scrollToSection('tournaments-section');
        break;
      case 'teams':
        scrollToSection('teams-section');
        break;
      case 'news':
        scrollToSection('news-section');
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Баннер дисциплины */}
        <div className={styles.banner}>
          <div className={styles.bannerOverlay} />
          <div className={styles.bannerContent}>
            <div className={styles.gameInfo}>
              <h1>Counter-Strike 2</h1>
              <p>Тактический шутер от первого лица, развивающийся с 2012 года</p>
              <div className={styles.metaInfo}>
                <span><FiStar /> Разработчик: Valve</span>
                <span><FiTarget /> Жанр: FPS</span>
                <span><FiMap /> Платформы: Windows, Linux</span>
              </div>
              <div className={styles.bannerActions}>
                <button className={styles.primaryButton}>
                  Смотреть матчи
                </button>
                <button className={styles.secondaryButton}>
                  Добавить в избранное
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Навигация по разделам */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => handleTabClick('overview')}
          >
            Обзор
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'tournaments' ? styles.active : ''}`}
            onClick={() => handleTabClick('tournaments')}
          >
            Турниры
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'teams' ? styles.active : ''}`}
            onClick={() => handleTabClick('teams')}
          >
            Команды
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'news' ? styles.active : ''}`}
            onClick={() => handleTabClick('news')}
          >
            Новости
          </button>
        </div>

        {/* Статистика */}
        <section id="overview-section" className={styles.section}>
          <h2 className={styles.sectionTitle}>Статистика CS2</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <FaUsers className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Активных игроков</h3>
                <p>1.2M</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaTrophy className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Турниров в 2024</h3>
                <p>156</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FiAward className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Призовой фонд</h3>
                <p>$12.5M</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaCrosshairs className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Популярное оружие</h3>
                <p>AK-47</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaMap className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Лучшая карта</h3>
                <p>Dust II</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaClock className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Среднее время матча</h3>
                <p>35 мин</p>
              </div>
            </div>
          </div>
        </section>

        {/* Предстоящие матчи */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Предстоящие матчи</h2>
          <div className={styles.matchesGrid}>
            <div className={styles.matchCard}>
              <div className={styles.matchHeader}>
                <span className={styles.tournamentName}>ESL Pro League Season 19</span>
                <span className={styles.matchStatus}>Предстоящий</span>
              </div>
              <div className={styles.teamsContainer}>
                <div className={styles.team}>
                  <img src="/images/teams/spirit.png" alt="Team Spirit" />
                  <span>Team Spirit</span>
                </div>
                <span className={styles.vs}>VS</span>
                <div className={styles.team}>
                  <img src="/images/teams/navi.png" alt="Natus Vincere" />
                  <span>Natus Vincere</span>
                </div>
              </div>
              <div className={styles.matchFooter}>
                <span className={styles.matchDate}>15 апреля 2024</span>
                <span className={styles.matchTime}>19:00</span>
              </div>
            </div>

            <div className={styles.matchCard}>
              <div className={styles.matchHeader}>
                <span className={styles.tournamentName}>BLAST Premier Spring Final</span>
                <span className={styles.matchStatus}>Предстоящий</span>
              </div>
              <div className={styles.teamsContainer}>
                <div className={styles.team}>
                  <img src="/images/teams/faze.png" alt="FaZe Clan" />
                  <span>FaZe Clan</span>
                </div>
                <span className={styles.vs}>VS</span>
                <div className={styles.team}>
                  <img src="/images/teams/g2.png" alt="G2 Esports" />
                  <span>G2 Esports</span>
                </div>
              </div>
              <div className={styles.matchFooter}>
                <span className={styles.matchDate}>12 апреля 2024</span>
                <span className={styles.matchTime}>20:30</span>
              </div>
            </div>
          </div>
        </section>

        {/* Турниры */}
        <section id="tournaments-section" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Турниры</h2>
            <button className={styles.addButton}>
              <FiPlus className={styles.addIcon} />
              Добавить турнир
            </button>
          </div>
          <div className={styles.tournamentsGrid}>
            <div className={styles.tournamentCard}>
              <div className={styles.tournamentHeader}>
                <img src="/images/organizers/pgl.png" alt="PGL" className={styles.organizerLogo} />
                <span className={styles.tournamentStatus}>Завершен</span>
              </div>
              <h3>PGL Major Copenhagen 2024</h3>
              <div className={styles.tournamentMeta}>
                <span><FiCalendar /> 21 марта - 3 апреля 2024</span>
                <span><FiAward /> $1,250,000</span>
                <span><FiUsers /> 24 команд</span>
                <span><FiMap /> Копенгаген, Дания</span>
              </div>
              <a href="#" className={styles.detailsLink}>Подробнее</a>
            </div>

            <div className={styles.tournamentCard}>
              <div className={styles.tournamentHeader}>
                <img src="/images/organizers/esl.png" alt="ESL" className={styles.organizerLogo} />
                <span className={styles.tournamentStatus}>Завершен</span>
              </div>
              <h3>IEM Katowice 2024</h3>
              <div className={styles.tournamentMeta}>
                <span><FiCalendar /> 31 января - 12 февраля 2024</span>
                <span><FiAward /> $1,000,000</span>
                <span><FiUsers /> 24 команд</span>
                <span><FiMap /> Катовице, Польша</span>
              </div>
              <a href="#" className={styles.detailsLink}>Подробнее</a>
            </div>

            <div className={styles.tournamentCard}>
              <div className={styles.tournamentHeader}>
                <img src="/images/organizers/blast.png" alt="BLAST" className={styles.organizerLogo} />
                <span className={styles.tournamentStatus}>Предстоящий</span>
              </div>
              <h3>BLAST Premier World Final 2024</h3>
              <div className={styles.tournamentMeta}>
                <span><FiCalendar /> 12-17 декабря 2024</span>
                <span><FiAward /> $1,000,000</span>
                <span><FiUsers /> 8 команд</span>
                <span><FiMap /> Абу-Даби, ОАЭ</span>
              </div>
              <a href="#" className={styles.detailsLink}>Подробнее</a>
            </div>
          </div>
        </section>

        {/* Топ команд */}
        <section id="teams-section" className={styles.section}>
          <h2 className={styles.sectionTitle}>Топ команд</h2>
          <div className={styles.teamsTable}>
            <div className={styles.tableHeader}>
              <span>#</span>
              <span>Команда</span>
              <span>Очки</span>
            </div>
            <div className={styles.teamRow}>
              <span className={styles.rank}>1</span>
              <div className={styles.teamInfo}>
                <img src="/images/teams/spirit.png" alt="Team Spirit" className={styles.teamLogo} />
                <span className={styles.teamName}>Team Spirit</span>
              </div>
              <span className={styles.points}>1200</span>
            </div>
            <div className={styles.teamRow}>
              <span className={styles.rank}>2</span>
              <div className={styles.teamInfo}>
                <img src="/images/teams/navi.png" alt="Natus Vincere" className={styles.teamLogo} />
                <span className={styles.teamName}>Natus Vincere</span>
              </div>
              <span className={styles.points}>1100</span>
            </div>
            <div className={styles.teamRow}>
              <span className={styles.rank}>3</span>
              <div className={styles.teamInfo}>
                <img src="/images/teams/vp.png" alt="Virtus.pro" className={styles.teamLogo} />
                <span className={styles.teamName}>Virtus.pro</span>
              </div>
              <span className={styles.points}>1050</span>
            </div>
            <div className={styles.teamRow}>
              <span className={styles.rank}>4</span>
              <div className={styles.teamInfo}>
                <img src="/images/teams/faze.png" alt="FaZe Clan" className={styles.teamLogo} />
                <span className={styles.teamName}>FaZe Clan</span>
              </div>
              <span className={styles.points}>1000</span>
            </div>
            <div className={styles.teamRow}>
              <span className={styles.rank}>5</span>
              <div className={styles.teamInfo}>
                <img src="/images/teams/g2.png" alt="G2 Esports" className={styles.teamLogo} />
                <span className={styles.teamName}>G2 Esports</span>
              </div>
              <span className={styles.points}>950</span>
            </div>
          </div>
        </section>

        {/* Игрок месяца */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Игрок месяца</h2>
          {loadingPlayer ? (
            <div className={styles.loadingState}>Загрузка данных игрока...</div>
          ) : playerError ? (
            <div className={styles.errorState}>Ошибка при загрузке данных игрока: {playerError}</div>
          ) : !playerOfMonth ? (
            <div className={styles.emptyState}>Данные игрока месяца отсутствуют</div>
          ) : (
            <div className={styles.playerSpotlight}>
              {user && user.role === 'admin' && (
                <button 
                  className={styles.editButton}
                  onClick={() => setShowPlayerForm(true)}
                >
                  <FiEdit2 />
                </button>
              )}
              <div className={styles.playerImage}>
                {playerOfMonth.image ? (
                  <img 
                    src={playerOfMonth.image} 
                    alt={playerOfMonth.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add(styles.noImage);
                    }}
                  />
                ) : (
                  <div className={styles.noImage}>
                    <FiUser size={80} />
                  </div>
                )}
              </div>
              <div className={styles.playerInfo}>
                <h3>{playerOfMonth.name}</h3>
                <div className={styles.playerTeam}>{playerOfMonth.team}</div>
                <div className={styles.playerRole}>{playerOfMonth.role}</div>
                <div className={styles.playerStats}>
                  <div className={styles.stat}>
                    <div className={styles.statValue}>{playerOfMonth.kills}</div>
                    <div className={styles.statLabel}>Убийств</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statValue}>{playerOfMonth.headshots}%</div>
                    <div className={styles.statLabel}>Хедшотов</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statValue}>{playerOfMonth.rating}</div>
                    <div className={styles.statLabel}>Рейтинг</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statValue}>{playerOfMonth.mvp}</div>
                    <div className={styles.statLabel}>MVP</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Последние новости */}
        <section id="news-section" className={styles.section}>
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
              <Link to="/news" className={styles.viewAll}>
                Все новости <FiArrowRight />
              </Link>
            </div>
          </div>
          {loading ? (
            <div className={styles.loadingState}>Загрузка новостей...</div>
          ) : error ? (
            <div className={styles.errorState}>Ошибка при загрузке новостей: {error}</div>
          ) : news.length === 0 ? (
            <div className={styles.emptyState}>Новостей пока нет</div>
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
                          e.target.src = '/images/news/default-news.jpg';
                        }}
                      />
                    </div>
                  )}
                  <div className={styles.newsContent}>
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                    <p className={styles.newsDescription}>
                      {item.description}
                    </p>
                    <div className={styles.newsMeta}>
                      <div className={styles.newsMetaLeft}>
                        <span className={styles.newsDate}>
                          <FiCalendar /> {new Date(item.created_at).toLocaleDateString('ru-RU')}
                        </span>
                        {item.author_name && (
                          <span className={styles.newsAuthor}>
                            <FiUser /> {item.author_name}
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

        {/* Модальные окна */}
        {showAddNewsForm && (
          <AddNewsForm 
            onClose={() => setShowAddNewsForm(false)}
            onAddNews={handleAddNews}
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

        {editingNews && (
          <AddNewsForm 
            onClose={() => setEditingNews(null)}
            onAddNews={handleUpdateNews}
            initialData={editingNews}
            isEditing={true}
          />
        )}

        {showPlayerForm && (
          <PlayerOfMonthForm
            onClose={() => setShowPlayerForm(false)}
            onSave={handleSavePlayer}
            initialData={playerOfMonth}
          />
        )}
      </div>
    </div>
  );
};

export default Cs2Page; 