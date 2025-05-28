import React from 'react';
import styles from '../styles/NewsModal.module.css';
import { FiX, FiCalendar, FiUser, FiTrash2, FiEdit2, FiTag } from 'react-icons/fi';

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

const NewsModal = ({ news, onClose, onDelete, onEdit, isAdmin }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Дата не указана';
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(news.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(news);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        
        {news.image_url && (
          <div className={styles.imageContainer}>
            <img 
              src={news.image_url} 
              alt={news.title} 
              className={styles.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-news.jpg';
              }}
            />
          </div>
        )}
        
        <div className={styles.content}>
          <h2 className={styles.title}>{news.title}</h2>
          <p className={styles.description}>{news.description}</p>
          <div className={styles.fullContent}>
            {news.content}
          </div>
          
          <div className={styles.footer}>
            <div className={styles.meta}>
              <span className={styles.date}>
                <FiCalendar /> {formatDate(news.created_at)}
              </span>
              {news.author_name && (
                <span className={styles.author}>
                  <FiUser /> {news.author_name}
                </span>
              )}
              {news.game_tag && (
                <span className={styles.gameTag}>
                  <FiTag /> {gameTags[news.game_tag] || news.game_tag}
                </span>
              )}
            </div>
            {isAdmin && (
              <div className={styles.actions}>
                <button 
                  className={styles.editButton}
                  onClick={handleEdit}
                >
                  <FiEdit2 /> Редактировать
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={handleDelete}
                >
                  <FiTrash2 /> Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal; 