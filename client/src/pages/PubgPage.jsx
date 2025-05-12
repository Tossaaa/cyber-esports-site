import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/PUBGPage.module.css';
import { FiCalendar, FiAward, FiUsers } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PubgPage = () => {
  // Данные турниров
  const tournamentData = [
    {
      id: 1,
      name: 'PUBG Global Championship 2024',
      date: '1-15 ноября 2024',
      prize: '$2,000,000',
      teams: 32,
      status: 'Предстоящий',
    },
    {
      id: 2,
      name: 'PCS 7 Europe',
      date: '15-30 сентября 2024',
      prize: '$500,000',
      teams: 16,
      status: 'Завершен'
    },
    {
      id: 3,
      name: 'PWS Phase 2',
      date: '10-25 июля 2024',
      prize: '$300,000',
      teams: 24,
      status: 'Завершен'
    }
  ];

  // Топ команд
  const topTeams = [
    { id: 1, name: 'Natus Vincere', rank: 1, points: 850 },
    { id: 2, name: 'FaZe Clan', rank: 2, points: 820 },
    { id: 3, name: 'Team Liquid', rank: 3, points: 790 },
    { id: 4, name: 'Gen.G', rank: 4, points: 760 },
    { id: 5, name: '4AM', rank: 5, points: 730 }
  ];

  // Популярные карты
  const popularMaps = [
    { id: 1, name: 'Erangel', matches: '45%', image: '/images/erangel.jpg' },
    { id: 2, name: 'Miramar', matches: '30%', image: '/images/miramar.jpg' },
    { id: 3, name: 'Sanhok', matches: '25%', image: '/images/sanhok.jpg' }
  ];

  return (
    <div className={styles.wrapper}>
      <Header />
      
      {/* Основной контент */}
      <div className={styles.container}>
        {/* Баннер дисциплины */}
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <div className={styles.gameInfo}>
              <h2>PUBG: BATTLEGROUNDS</h2>
              <p>Королевская битва на выживание в реалистичном мире</p>
              <div className={styles.metaInfo}>
                <span>Разработчик: Krafton</span>
                <span>Жанр: Battle Royale</span>
                <span>Платформы: Windows, PlayStation, Xbox</span>
              </div>
            </div>
          </div>
        </div>

        {/* Турниры */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Турниры</h2>
          <div className={styles.tournaments}>
            {tournamentData.map(tournament => (
              <div 
                key={tournament.id} 
                className={`${styles.tournamentCard} ${tournament.featured ? styles.featured : ''}`}
              >
                {tournament.featured && 
                  <div className={styles.featuredBadge}>Главный турнир</div>
                }
                <h3>{tournament.name}</h3>
                <div className={styles.tournamentMeta}>
                  <span><FiCalendar /> {tournament.date}</span>
                  <span><FiAward /> {tournament.prize}</span>
                  <span><FiUsers /> {tournament.teams} команд</span>
                </div>
                <div className={`${styles.status} ${
                  tournament.status === 'Предстоящий' 
                    ? styles.upcomingStatus 
                    : styles.completedStatus
                }`}>
                  {tournament.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Топ команд */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Мировой рейтинг</h2>
          <div className={styles.teamsTable}>
            <div className={styles.tableHeader}>
              <span>#</span>
              <span>Команда</span>
              <span>Очки</span>
            </div>
            {topTeams.map(team => (
              <div key={team.id} className={styles.teamRow}>
                <span className={styles.rank}>{team.rank}</span>
                <span className={styles.teamName}>{team.name}</span>
                <span className={styles.points}>{team.points}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Популярные карты */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Популярные карты</h2>
          <div className={styles.mapsGrid}>
            {popularMaps.map(map => (
              <div key={map.id} className={styles.mapCard}>
                <img src={map.image} alt={map.name} className={styles.mapImage} />
                <div className={styles.mapInfo}>
                  <h3>{map.name}</h3>
                  <p>Матчей: {map.matches}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PubgPage;