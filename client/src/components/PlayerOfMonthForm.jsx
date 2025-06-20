import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiLoader } from 'react-icons/fi';
import styles from '../styles/CS2Page.module.css';
import { FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const PlayerOfMonthForm = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    role: '',
    kills: '',
    headshots: '',
    rating: '',
    mvp: '',
    image: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.image) {
        setPreviewImage(initialData.image);
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

    console.log('Selected file:', file);

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

      console.log('Sending request to upload image...');

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при загрузке изображения');
      }

      const data = await response.json();
      console.log('Upload response data:', data);
      
      const imageUrl = data.imageUrl.startsWith('http') ? data.imageUrl : `${API_BASE_URL}${data.imageUrl}`;
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));

      console.log('Setting preview image URL:', imageUrl);
      setPreviewImage(imageUrl);

    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Произошла ошибка при загрузке изображения.');
      setPreviewImage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave({ ...formData });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{initialData ? 'Редактировать игрока месяца' : 'Добавить игрока месяца'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.playerForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя игрока</label>
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
            <label htmlFor="team">Команда</label>
            <input
              type="text"
              id="team"
              name="team"
              value={formData.team}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Роль</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="kills">Убийств</label>
              <input
                type="number"
                id="kills"
                name="kills"
                value={formData.kills}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="headshots">Хедшотов (%)</label>
              <input
                type="number"
                id="headshots"
                name="headshots"
                value={formData.headshots}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="rating">Рейтинг</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                step="0.01"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="mvp">MVP</label>
              <input
                type="number"
                id="mvp"
                name="mvp"
                value={formData.mvp}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
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
                       setFormData(prev => ({ ...prev, image: '' }));
                     }}
                   >
                     <FaTimes />
                   </button>
               </div>
             )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : (initialData ? 'Сохранить изменения' : 'Добавить игрока')}
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

export default PlayerOfMonthForm; 