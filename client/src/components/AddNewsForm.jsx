import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/AddNewsForm.module.css';

const AddNewsForm = ({ onClose, onAddNews, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: ''
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

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер изображения не должен превышать 5MB');
      return;
    }

    try {
      // Создаем FormData для отправки файла
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        image_url: data.imageUrl
      }));

      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Необходимо авторизоваться для добавления новости');
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEditing 
        ? `http://localhost:5001/api/news/${formData.id}`
        : 'http://localhost:5001/api/news';
      
      const method = isEditing ? 'PUT' : 'POST';

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
      onAddNews(data);
      onClose();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || `Ошибка при ${isEditing ? 'обновлении' : 'добавлении'} новости. Проверьте подключение к серверу.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        
        <h2>{isEditing ? 'Редактировать новость' : 'Добавить новость'}</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Заголовок</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Введите заголовок новости"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Краткое описание</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Введите краткое описание"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Содержание</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Введите содержание новости"
              rows="6"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Изображение</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {previewImage && (
              <div className={styles.imagePreview}>
                <img src={previewImage} alt="Preview" />
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
              {isSubmitting ? (isEditing ? 'Сохранение...' : 'Добавление...') : (isEditing ? 'Сохранить' : 'Добавить новость')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsForm; 