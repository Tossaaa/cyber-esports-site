import React from 'react';
import { FiX, FiCalendar, FiDollarSign, FiMapPin, FiUser, FiUsers, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from '../styles/TournamentModal.module.css';

const TournamentModal = ({ tournament, onClose, onEdit, onDelete, isAdmin }) => {
  const getStatus = () => {
    const now = new Date();
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Предстоящий';
      case 'ongoing':
        return 'Текущий';
      case 'completed':
        return 'Завершен';
      default:
        return status;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>

        <div className={styles.modalHeader}>
          <h2>{tournament.name}</h2>
          <div className={`${styles.tournamentStatus} ${styles[getStatus()]}`}>
            {getStatusText(getStatus())}
          </div>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.tournamentInfo}>
            <div className={styles.infoSection}>
              <h3>Даты турнира</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <FiCalendar className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Начало</span>
                    <span className={styles.infoValue}>{formatDate(tournament.start_date)}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <FiCalendar className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Окончание</span>
                    <span className={styles.infoValue}>{formatDate(tournament.end_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3>Детали турнира</h3>
              <div className={styles.infoGrid}>
                {tournament.prize_pool && (
                  <div className={styles.infoItem}>
                    <FiDollarSign className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Призовой фонд</span>
                      <span className={styles.infoValue}>{tournament.prize_pool}</span>
                    </div>
                  </div>
                )}
                {tournament.location && (
                  <div className={styles.infoItem}>
                    <FiMapPin className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Место проведения</span>
                      <span className={styles.infoValue}>{tournament.location}</span>
                    </div>
                  </div>
                )}
                {tournament.organizer && (
                  <div className={styles.infoItem}>
                    <FiUser className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Организатор</span>
                      <span className={styles.infoValue}>{tournament.organizer}</span>
                    </div>
                  </div>
                )}
                {tournament.format && (
                  <div className={styles.infoItem}>
                    <FiUsers className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Формат</span>
                      <span className={styles.infoValue}>{tournament.format}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {tournament.teams && tournament.teams.length > 0 && (
              <div className={styles.infoSection}>
                <h3>Участники</h3>
                <div className={styles.teamsList}>
                  {tournament.teams.map((team, index) => (
                    <div key={index} className={styles.teamItem}>
                      <FiUsers className={styles.teamIcon} />
                      <span className={styles.teamName}>
                        {typeof team === 'object' ? team.name : team}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className={styles.modalActions}>
            <button className={styles.editButton} onClick={() => onEdit(tournament)}>
              <FiEdit2 />
              Редактировать
            </button>
            <button className={styles.deleteButton} onClick={() => onDelete(tournament)}>
              <FiTrash2 />
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentModal; 