import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUpload } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/TournamentForm.module.css';

const TournamentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    prize: '',
    teams: '',
    location: '',
    organizer: '',
    logo: null,
    status: 'upcoming'
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Установка минимальной даты как сегодняшней
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      startDate: today,
      endDate: today
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Валидация дат
    if (name === 'startDate' && value > formData.endDate) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        endDate: value
      }));
    } else if (name === 'endDate' && value < formData.startDate) {
      setError('Дата окончания не может быть раньше даты начала');
      return;
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер изображения не должен превышать 5MB');
        return;
      }

      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, загрузите изображение');
        return;
      }

      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Введите название турнира');
      return false;
    }
    if (!formData.organizer.trim()) {
      setError('Введите название организатора');
      return false;
    }
    if (!formData.prize) {
      setError('Введите призовой фонд');
      return false;
    }
    if (!formData.teams || formData.teams < 2) {
      setError('Минимальное количество команд - 2');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Введите место проведения');
      return false;
    }
    if (!formData.logo) {
      setError('Загрузите логотип турнира');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch('http://localhost:5001/api/tournaments', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при создании турнира');
      }

      navigate('/discipline/cs2');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    navigate('/discipline/cs2');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          <FaTimes />
        </button>
        
        <h2>{isEditing ? 'Редактировать турнир' : 'Добавить турнир'}</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Название турнира</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Введите название турнира"
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="organizer">Организатор</label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
              placeholder="Введите название организатора"
              maxLength={50}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.prizePool}`}>
            <div className={styles.prizeInput}>
              <label htmlFor="prize">Призовой фонд</label>
              <input
                type="number"
                id="prize"
                name="prize"
                value={formData.prize}
                onChange={handleChange}
                required
                placeholder="Введите сумму"
                min="0"
                step="1000"
              />
              <span>$</span>
            </div>
            <div className={styles.prizeInput}>
              <label htmlFor="teams">Количество команд</label>
              <input
                type="number"
                id="teams"
                name="teams"
                value={formData.teams}
                onChange={handleChange}
                required
                placeholder="Введите количество"
                min="2"
                max="32"
              />
              <span>команд</span>
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.dates}`}>
            <div className={styles.dateInput}>
              <label htmlFor="startDate">
                <FiCalendar /> Дата начала
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className={styles.dateInput}>
              <label htmlFor="endDate">
                <FiCalendar /> Дата окончания
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="location">Место проведения</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Введите место проведения"
              maxLength={100}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.status}`}>
            <label htmlFor="status">Статус турнира</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="upcoming">Предстоящий</option>
              <option value="ongoing">Текущий</option>
              <option value="completed">Завершенный</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.imageUpload}`}>
            <label>Логотип турнира</label>
            <div 
              className={styles.uploadPreview} 
              onClick={() => document.getElementById('logo').click()}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  document.getElementById('logo').click();
                }
              }}
            >
              {preview ? (
                <img src={preview} alt="Предпросмотр логотипа" />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FiUpload />
                  <p>Нажмите для загрузки изображения</p>
                  <span className={styles.uploadHint}>PNG, JPG до 5MB</span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
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
              {isSubmitting ? (isEditing ? 'Сохранение...' : 'Добавление...') : (isEditing ? 'Сохранить' : 'Добавить турнир')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentForm; 