import React, { useState, useEffect } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import styles from '../styles/CS2Page.module.css';

const TournamentForm = ({ onClose, onSave, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    teamIds: [],
    prize_pool: '',
    organizer: '',
    location: '',
    format: 'BO1'
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

  useEffect(() => {
    if (initialData) {
      // Преобразуем даты в формат YYYY-MM-DD для input type="date"
      const formatDateForInput = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
      };

      // Убедимся, что teams преобразованы в массив ID
      const teamIds = initialData.teams ? initialData.teams.map(team => 
        typeof team === 'object' ? team.id : parseInt(team)
      ) : [];

      console.log('Initial team IDs:', teamIds); // Добавим логирование

      setFormData({
        ...initialData,
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
        teamIds: teamIds
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Специальная обработка для поля призового фонда
    if (name === 'prize_pool') {
      // Удаляем все символы кроме цифр и $
      const cleanedValue = value.replace(/[^\d$]/g, '');
      // Убеждаемся, что $ только в начале
      const formattedValue = cleanedValue.replace(/\$+/g, '$').replace(/\$(?=.*\$)/g, '');
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }

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

    if (!formData.prize_pool.trim()) {
      throw new Error('Призовой фонд обязателен');
    }

    // Проверяем формат призового фонда
    if (!/^\$\d+$/.test(formData.prize_pool)) {
      throw new Error('Призовой фонд должен быть в формате $число (например: $100000)');
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (!isEditing && startDate < now) {
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
        game: 'cs2',
        teams: formData.teamIds.map(id => parseInt(id)) // Убедимся, что ID команд преобразованы в числа
      };

      delete tournamentData.teamIds;

      const url = isEditing 
        ? `http://localhost:5001/api/tournaments/${initialData.id}`
        : 'http://localhost:5001/api/tournaments';

      const method = isEditing ? 'PUT' : 'POST';

      console.log('Sending tournament data:', tournamentData); // Добавим логирование

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tournamentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Ошибка при ${isEditing ? 'обновлении' : 'создании'} турнира`);
      }

      onSave(data);
      onClose();
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} tournament:`, err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? 'Редактировать турнир' : 'Создать турнир'}</h2>
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
            <label htmlFor="prize_pool">Призовой фонд *</label>
            <input
              type="text"
              id="prize_pool"
              name="prize_pool"
              value={formData.prize_pool}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Например: $100000"
              pattern="^\$\d+$"
              title="Введите сумму в формате $число (например: $100000)"
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
              <option value="BO3">BO3 (Best of 3)</option>
              <option value="BO5">BO5 (Best of 5)</option>
            </select>
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
                  {isEditing ? 'Сохранение...' : 'Создание...'}
                </>
              ) : (
                isEditing ? 'Сохранить изменения' : 'Создать турнир'
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