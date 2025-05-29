import React, { useState, useEffect } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import styles from '../styles/CS2Page.module.css';

const TournamentForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    teamIds: [],
    prize_pool: '',
    organizer: '',
    location: '',
    format: 'BO1',
    rules: '',
    logo: ''
  });
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const response = await fetch('http://localhost:5001/api/teams/cs2');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке команд');
        }
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Ошибка при загрузке команд');
      } finally {
        setIsLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Если изменилась дата начала, проверяем дату окончания
    if (name === 'start_date' && formData.end_date && new Date(value) >= new Date(formData.end_date)) {
      setFormData(prev => ({
        ...prev,
        end_date: ''
      }));
    }
  };

  const handleTeamSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      teamIds: selectedOptions
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error('Название турнира обязательно');
    }

    if (!formData.start_date) {
      throw new Error('Дата начала обязательна');
    }

    if (!formData.end_date) {
      throw new Error('Дата окончания обязательна');
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (startDate < now) {
      throw new Error('Дата начала не может быть в прошлом');
    }

    if (endDate <= startDate) {
      throw new Error('Дата окончания должна быть позже даты начала');
    }

    if (formData.teamIds.length === 0) {
      throw new Error('Выберите хотя бы одну команду');
    }

    if (formData.teamIds.length < 2) {
      throw new Error('Для турнира необходимо минимум 2 команды');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходимо авторизоваться');
      }

      validateForm();

      // Преобразуем данные для отправки
      const tournamentData = {
        ...formData,
        teams: formData.teamIds, // Переименовываем teamIds в teams
        startDate: formData.start_date, // Переименовываем start_date в startDate
        endDate: formData.end_date, // Переименовываем end_date в endDate
        prizePool: formData.prize_pool, // Переименовываем prize_pool в prizePool
      };

      // Удаляем старые поля
      delete tournamentData.teamIds;
      delete tournamentData.start_date;
      delete tournamentData.end_date;
      delete tournamentData.prize_pool;

      console.log('Отправка данных турнира:', tournamentData);

      const response = await fetch('http://localhost:5001/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tournamentData)
      });

      const data = await response.json();
      console.log('Ответ сервера:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при создании турнира');
      }

      onSave(data);
      onClose();
    } catch (err) {
      console.error('Error creating tournament:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Создать турнир</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
            <FiX />
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.teamForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Название турнира
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Введите название турнира"
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              disabled={isSubmitting}
              placeholder="Введите описание турнира"
              maxLength={500}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prize_pool">Призовой фонд</label>
            <input
              type="text"
              id="prize_pool"
              name="prize_pool"
              value={formData.prize_pool}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Например: $100,000"
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
              disabled={isSubmitting}
              placeholder="Название организатора"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Локация</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Место проведения турнира"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="format">Формат матчей</label>
            <select
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="BO1">BO1 (Best of 1)</option>
              <option value="BO2">BO2 (Best of 2)</option>
              <option value="BO3">BO3 (Best of 3)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rules">Правила турнира</label>
            <textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows="4"
              disabled={isSubmitting}
              placeholder="Введите правила турнира"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="start_date">
              Дата начала
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="end_date">
              Дата окончания
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="teams">
              Выберите команды
            </label>
            {isLoadingTeams ? (
              <div className={styles.loadingTeams}>
                <FiLoader className={styles.spinner} />
                <span>Загрузка команд...</span>
              </div>
            ) : (
              <>
                <select
                  id="teams"
                  name="teams"
                  multiple
                  value={formData.teamIds}
                  onChange={handleTeamSelect}
                  disabled={isSubmitting}
                  className={styles.teamSelect}
                  required
                  size={5}
                >
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {formData.teamIds.length > 0 && (
                  <div className={styles.selectedTeams}>
                    Выбрано команд: {formData.teamIds.length}
                  </div>
                )}
              </>
            )}
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.saveButton} 
              disabled={isSubmitting || isLoadingTeams}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className={styles.spinner} />
                  Создание...
                </>
              ) : (
                'Создать турнир'
              )}
            </button>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentForm; 