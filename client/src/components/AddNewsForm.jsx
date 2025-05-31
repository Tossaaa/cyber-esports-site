import React, { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/AddNewsForm.module.css';

const gameTags = [
  { id: 'cs2', name: 'CS2' },
  { id: 'dota', name: 'Dota 2' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'pubg', name: 'PUBG' },
  { id: 'lol', name: 'League of Legends' },
  { id: 'fortnite', name: 'Fortnite' },
  { id: 'apex', name: 'Apex Legends' },
  { id: 'overwatch', name: 'Overwatch 2' }
];

const AddNewsForm = ({ onClose, onAddNews, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    game_tag: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.image_url) {
        setPreviewImage(initialData.image_url);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите файл изображения.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер изображения не должен превышать 5MB.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходимо авторизоваться для загрузки изображения.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при загрузке изображения');
      }

      const data = await response.json();
      const imageUrl = data.imageUrl.startsWith('http') ? data.imageUrl : `http://localhost:5001${data.imageUrl}`;
      
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
      setPreviewImage(imageUrl);

    } catch (err) {
      setError(err.message || 'Произошла ошибка при загрузке изображения.');
      setPreviewImage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);

    try {
      const url = isEditing 
        ? `http://localhost:5001/api/news/${formData.id}`
        : 'http://localhost:5001/api/news';
      
      const method = isEditing ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходимо авторизоваться для добавления новости');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Ошибка при ${isEditing ? 'обновлении' : 'добавлении'} новости`);
      }

      const data = await response.json();
      onClose();
      onAddNews(data);
    } catch (err) {
      setError(err.message || `Ошибка при ${isEditing ? 'обновлении' : 'добавлении'} новости. Проверьте подключение к серверу.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? 'Редактировать новость' : 'Добавить новость'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Заголовок</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Например: Natus Vincere выиграли матч против FaZe Clan"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="game_tag">Игра</label>
            <select
              id="game_tag"
              name="game_tag"
              value={formData.game_tag}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value="">Выберите игру</option>
              {gameTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Краткое описание</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Краткое описание новости, которое будет отображаться в карточке"
              disabled={isSubmitting}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="content">Содержание</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Подробное содержание новости. Расскажите о событии, используйте форматирование текста для лучшей читаемости..."
              rows="6"
              disabled={isSubmitting}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.imageUploadGroup}`}>
            <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
              {previewImage ? 'Изменить изображение' : 'Загрузить изображение'}
              <FiUpload style={{ marginLeft: '0.5rem' }} />
            </label>
            <input
              type="file"
              id="imageUpload"
              className={styles.imageUploadInput}
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            {previewImage && (
              <div className={styles.imagePreviewContainer}>
                <img src={previewImage} alt="Превью" className={styles.imagePreview} />
                <button
                  type="button"
                  className={styles.removeImageButton}
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData(prev => ({ ...prev, image_url: '' }));
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Добавить новость')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsForm; 