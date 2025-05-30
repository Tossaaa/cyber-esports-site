import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiCalendar, FiUser, FiTag, FiFilter, FiLoader, FiAlertCircle, FiFileText, FiSearch } from "react-icons/fi";
import styles from "../styles/NewsPage.module.css";
import AddNewsForm from "../components/AddNewsForm";
import NewsModal from "../components/NewsModal";
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const gameTags = {
  all: 'Все новости',
  cs2: 'CS2',
  dota: 'Dota 2',
  valorant: 'Valorant',
  pubg: 'PUBG',
  lol: 'League of Legends',
  fortnite: 'Fortnite',
  apex: 'Apex Legends',
  overwatch: 'Overwatch 2'
};

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/news');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке новостей');
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async (newNews) => {
    try {
      // Обновляем список новостей с полученными данными
      setNews(prev => [newNews, ...prev]);
      setShowAddNewsForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при добавлении новости:', err);
    }
  };

  const handleDeleteNews = async (newsId) => {
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

  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseNewsModal = () => {
    setSelectedNews(null);
  };

  const handleEditNews = (news) => {
    setEditingNews(news);
    setSelectedNews(null);
  };

  const handleUpdateNews = async (updatedNews) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/news/${updatedNews.id}`, {
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
      const newsResponse = await fetch('http://localhost:5001/api/news');
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    const header = document.querySelector('header');
    if (header) {
      const event = new CustomEvent('userLoggedIn', { detail: userData });
      header.dispatchEvent(event);
    }
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
  };

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.game_tag === selectedTag));
    }
  }, [selectedTag, news]);

  useEffect(() => {
    const filtered = news.filter(item => {
      const matchesTag = selectedTag === 'all' || item.game_tag === selectedTag;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
    setFilteredNews(filtered);
  }, [selectedTag, news, searchQuery]);

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка новостей...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Новости</h1>
          <div className={styles.headerActions}>
            {user?.role === 'admin' && (
              <button 
                className={styles.addNewsButton}
                onClick={() => setShowAddNewsForm(true)}
              >
                <FiPlus />
                Добавить новость
              </button>
            )}
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterContainer}>
            <FiFilter className={styles.filterIcon} />
            <select 
              className={`${styles.tagFilter} ${selectedTag === 'all' ? styles.tagFilterDefault : ''}`}
              value={selectedTag}
              onChange={handleTagChange}
            >
              {Object.entries(gameTags).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <FiLoader size={32} />
            <p>Загрузка новостей...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <FiAlertCircle size={32} />
            <p>Ошибка при загрузке новостей: {error}</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className={styles.emptyState}>
            <FiFileText size={32} />
            <p>Новостей не найдено</p>
            <span>Попробуйте изменить параметры поиска или фильтры</span>
          </div>
        ) : (
          <div className={styles.newsGrid}>
            {filteredNews.map((item) => (
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
      </div>

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
          isAdmin={user?.role === 'admin'}
        />
      )}

      {editingNews && (
        <AddNewsForm
          initialData={editingNews}
          onClose={() => setEditingNews(null)}
          onAddNews={handleUpdateNews}
          isEditing={true}
        />
      )}

      {showLoginForm && (
        <LoginForm 
          onClose={() => setShowLoginForm(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

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

export default NewsPage; 