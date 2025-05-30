import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/TournamentsPage.module.css';
import { 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiDollarSign, 
  FiMapPin, 
  FiUsers, 
  FiUser, 
  FiArrowRight,
  FiPlus,
  FiClock,
  FiAward,
  FiEye
} from 'react-icons/fi';
import TournamentModal from '../components/TournamentModal';
import TournamentForm from '../components/TournamentForm';

const gameTags = {
  all: 'Все игры',
  cs2: 'CS2',
  dota: 'Dota 2',
  valorant: 'Valorant',
  pubg: 'PUBG',
  lol: 'League of Legends',
  fortnite: 'Fortnite',
  apex: 'Apex Legends',
  overwatch: 'Overwatch 2'
};

const statusFilters = {
  all: 'Все турниры',
  upcoming: 'Предстоящие',
  ongoing: 'Идут сейчас',
  completed: 'Завершенные'
};

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showTournamentForm, setShowTournamentForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      console.log('Fetching tournaments...');
      const response = await fetch('http://localhost:5001/api/tournaments');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке турниров');
      }
      const data = await response.json();
      console.log('Received tournaments:', data);
      setTournaments(data);
      setFilteredTournaments(data);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Initial useEffect triggered');
    fetchTournaments();
  }, []);

  useEffect(() => {
    console.log('Filtering useEffect triggered');
    console.log('Current state:', {
      tournaments,
      selectedGame,
      selectedStatus,
      searchQuery,
      sortBy
    });
    let filtered = [...tournaments];

    // Фильтрация по игре
    if (selectedGame !== 'all') {
      filtered = filtered.filter(t => t.game === selectedGame);
    }

    // Фильтрация по статусу
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => getStatus(t) === selectedStatus);
    }

    // Поиск по названию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        (t.organizer && t.organizer.toLowerCase().includes(query))
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.start_date) - new Date(a.start_date);
      } else if (sortBy === 'prize') {
        const prizeA = parsePrizePool(a.prize_pool);
        const prizeB = parsePrizePool(b.prize_pool);
        return prizeB - prizeA;
      }
      return 0;
    });

    setFilteredTournaments(filtered);
  }, [tournaments, selectedGame, selectedStatus, searchQuery, sortBy]);

  const getStatus = (tournament) => {
    const now = new Date();
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);
    if (now > endDate) {
      return 'completed';
    } else if (now >= startDate && now <= endDate) {
      return 'ongoing';
    } else {
      return 'upcoming';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'ongoing':
        return 'Идет сейчас';
      case 'upcoming':
        return 'Предстоящий';
      default:
        return 'Неизвестный статус';
    }
  };

  const parsePrizePool = (prizePool) => {
    if (!prizePool) return 0;
    const match = prizePool.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  const handleCloseModal = () => {
    setSelectedTournament(null);
  };

  const handleEditTournament = (tournament) => {
    setSelectedTournament(null);
    setShowTournamentForm(true);
  };

  const handleDeleteTournament = async (tournament) => {
    if (window.confirm('Вы уверены, что хотите удалить этот турнир?')) {
      try {
        await fetch(`http://localhost:5001/api/tournaments/${tournament.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTournaments(tournaments.filter(t => t.id !== tournament.id));
        setSelectedTournament(null);
      } catch (error) {
        console.error('Error deleting tournament:', error);
        alert('Ошибка при удалении турнира');
      }
    }
  };

  const handleSaveTournament = async (tournamentData) => {
    try {
      const response = await fetch('http://localhost:5001/api/tournaments');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке турниров');
      }
      const tournaments = await response.json();
      setTournaments(tournaments);
      setShowTournamentForm(false);
    } catch (err) {
      console.error('Error saving tournament:', err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Турниры</h1>
          {user && user.role === 'admin' && (
            <button 
              className={styles.addButton}
              onClick={() => setShowTournamentForm(true)}
            >
              <FiPlus /> Добавить турнир
            </button>
          )}
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск турниров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            className={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            Фильтры
          </button>

          {showFilters && (
            <div className={styles.filterOptions}>
              <div className={styles.filterGroup}>
                <label>Игра:</label>
                <select 
                  value={selectedGame} 
                  onChange={(e) => setSelectedGame(e.target.value)}
                >
                  {Object.entries(gameTags).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Статус:</label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {Object.entries(statusFilters).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Сортировка:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">По дате</option>
                  <option value="prize">По призовому фонду</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <FiClock className={styles.loadingIcon} />
            Загрузка турниров...
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <FiAward className={styles.errorIcon} />
            Ошибка при загрузке турниров: {error}
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className={styles.emptyState}>
            <FiAward className={styles.emptyIcon} />
            Турниры не найдены
          </div>
        ) : (
          <div className={styles.tournamentsGrid}>
            {filteredTournaments.map(tournament => (
              <div
                key={tournament.id}
                className={styles.tournamentCard}
                onClick={() => handleTournamentClick(tournament)}
              >
                <div className={styles.tournamentHeader}>
                  <h3>{tournament.name}</h3>
                  <div className={`${styles.tournamentStatus} ${styles[getStatus(tournament)]}`}>
                    {getStatusText(getStatus(tournament))}
                  </div>
                </div>

                <div className={styles.tournamentDates}>
                  <div className={styles.dateItem}>
                    <FiCalendar className={styles.dateIcon} />
                    <span>Начало: {formatDate(tournament.start_date)}</span>
                  </div>
                  <div className={styles.dateItem}>
                    <FiCalendar className={styles.dateIcon} />
                    <span>Конец: {formatDate(tournament.end_date)}</span>
                  </div>
                </div>

                <div className={styles.tournamentDetails}>
                  {tournament.prize_pool && (
                    <div className={styles.detailItem}>
                      <FiDollarSign className={styles.detailIcon} />
                      <span>{tournament.prize_pool}</span>
                    </div>
                  )}
                  {tournament.location && (
                    <div className={styles.detailItem}>
                      <FiMapPin className={styles.detailIcon} />
                      <span>{tournament.location}</span>
                    </div>
                  )}
                  {tournament.organizer && (
                    <div className={styles.detailItem}>
                      <FiUser className={styles.detailIcon} />
                      <span>{tournament.organizer}</span>
                    </div>
                  )}
                  {tournament.format && (
                    <div className={styles.detailItem}>
                      <FiUsers className={styles.detailIcon} />
                      <span>{tournament.format}</span>
                    </div>
                  )}
                </div>

                {tournament.teams && tournament.teams.length > 0 && (
                  <div className={styles.tournamentTeams}>
                    <h4>
                      Участники
                      <span>{tournament.teams.length} команд</span>
                    </h4>
                    <ul>
                      {tournament.teams.slice(0, 3).map((team, index) => (
                        <li key={index}>
                          {typeof team === 'object' ? team.name : team}
                        </li>
                      ))}
                    </ul>
                    {tournament.teams.length > 3 && (
                      <div className={styles.remainingTeams}>
                        +{tournament.teams.length - 3} команд
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTournament && (
          <TournamentModal
            tournament={selectedTournament}
            onClose={handleCloseModal}
            onEdit={handleEditTournament}
            onDelete={handleDeleteTournament}
            isAdmin={user && user.role === 'admin'}
          />
        )}

        {showTournamentForm && (
          <TournamentForm
            onClose={() => setShowTournamentForm(false)}
            onSave={handleSaveTournament}
          />
        )}
      </div>
    </div>
  );
};

export default TournamentsPage; 