import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiCalendar, FiUser } from "react-icons/fi";
import styles from "../styles/NewsPage.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddNewsForm from "../components/AddNewsForm";
import NewsModal from "../components/NewsModal";
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newNews),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при добавлении новости');
      }

      const addedNews = await response.json();
      setNews(prevNews => [addedNews, ...prevNews]);
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
      const response = await fetch(`http://localhost:5001/api/news/${newsId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении новости');
      }

      await fetchNews();
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    // Обновляем состояние пользователя в Header
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

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка новостей...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Header 
        onLoginClick={() => setShowLoginForm(true)}
        onRegisterClick={() => setShowRegisterForm(true)}
      />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Новости</h1>
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
                      onClick={(e) => { e.stopPropagation(); handleDeleteNews(item.id); }}
                    >
                      <FiTrash2 /> Удалить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />

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

export default NewsPage; 