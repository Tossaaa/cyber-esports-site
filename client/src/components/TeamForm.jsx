import React, { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import styles from '../styles/CS2Page.module.css';
import { FaTimes } from 'react-icons/fa';

const TeamForm = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    points: '',
    country: '',
    founded: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      console.log('Setting initial data:', initialData);
      setFormData({
        name: initialData.name || '',
        logo: initialData.logo || '',
        points: initialData.points || '',
        country: initialData.country || '',
        founded: initialData.founded || '',
        description: initialData.description || ''
      });
      if (initialData.logo) {
        setPreviewImage(initialData.logo);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Проверяем только поле points
    if (name === 'points') {
      const points = parseInt(value);
      if (points > 1000) {
        setError('Количество баллов не может превышать 1000');
        return;
      }
      setError('');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Selected file:', file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходимо авторизоваться для загрузки изображения');
        return;
      }

      console.log('Sending request to upload image...');
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Upload response status:', response.status);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const data = await response.json();
      console.log('Upload response data:', data);

      setFormData(prev => ({
        ...prev,
        logo: data.imageUrl
      }));

      console.log('Setting preview image URL:', data.imageUrl);
      setPreviewImage(data.imageUrl);

    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Ошибка при загрузке изображения');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);

    // Проверяем points перед отправкой
    const points = parseInt(formData.points);
    if (points > 1000) {
      setError('Количество баллов не может превышать 1000');
      setIsSubmitting(false);
      return;
    }

    try {
    console.log("Saving team data:", formData);
      await onSave(formData);
    onClose();
    } catch (err) {
      console.error('Error saving team:', err);
      setError(err.message || 'Ошибка при сохранении команды');
    } finally {
    setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{initialData ? 'Редактировать команду' : 'Добавить команду'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.teamForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Название команды</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="country">Страна</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="founded">Год основания</label>
            <input
              type="number"
              id="founded"
              name="founded"
              value={formData.founded}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="points">Очки</label>
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="4"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.imageUploadGroup}`}>
            <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
              {previewImage ? 'Изменить логотип' : 'Загрузить логотип'}
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
                    setFormData(prev => ({ ...prev, logo: '' }));
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : (initialData ? 'Сохранить изменения' : 'Добавить команду')}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm; 