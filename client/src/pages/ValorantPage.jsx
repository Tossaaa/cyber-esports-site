import React from 'react';
import styles from '../styles/ValorantPage.module.css';
import { FiCalendar, FiAward, FiUsers } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ValorantPage = () => {
  // Данные турниров
  const tournamentData = [
    {
      id: 1,
      name: 'VCT Champions 2024',
      date: '1-15 декабря 2024',
      prize: '$2,500,000',
      teams: 16,
      status: 'Предстоящий',
    },
    {
      id: 2,
      name: 'VCT Masters Tokyo',
      date: '12-25 июня 2024',
      prize: '$1,000,000',
      teams: 12,
      status: 'Завершен'
    },
    {
      id: 3,
      name: 'VCT LOCK//IN',
      date: '10-25 февраля 2024',
      prize: '$500,000',
      teams: 32,
      status: 'Завершен'
    }
  ];

  // Топ команд
  const topTeams = [
    { id: 1, name: 'Sentinels', rank: 1, points: 1200 },
    { id: 2, name: 'Fnatic', rank: 2, points: 1150 },
    { id: 3, name: 'DRX', rank: 3, points: 1100 },
    { id: 4, name: 'LOUD', rank: 4, points: 1050 },
    { id: 5, name: 'Team Liquid', rank: 5, points: 1000 }
  ];

  // Популярные агенты
  const popularAgents = [
    { id: 1, name: 'Jett', pickRate: '35%', role: 'Дуэлянт', image: '/images/jett.png' },
    { id: 2, name: 'Phoenix', pickRate: '28%', role: 'Дуэлянт', image: '/images/phoenix.png' },
    { id: 3, name: 'Sova', pickRate: '25%', role: 'Инициатор', image: '/images/sova.png' }
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
              <h2>Valorant</h2>
              <p>Тактический шутер от первого лица с уникальными способностями</p>
              <div className={styles.metaInfo}>
                <span>Разработчик: Riot Games</span>
                <span>Жанр: FPS</span>
                <span>Платформы: Windows</span>
              </div>
            </div>
          </div>
        </div>

        {/* Турниры */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Турниры VCT</h2>
          <div className={styles.tournaments}>
            {tournamentData.map(tournament => (
              <div 
                key={tournament.id} 
                className={`${styles.tournamentCard} ${tournament.featured ? styles.featured : ''}`}
              >
                {tournament.featured && 
                  <div className={styles.featuredBadge}>Мейджор</div>
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
              <span>Очки VCT</span>
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

        {/* Популярные агенты */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Популярные агенты</h2>
          <div className={styles.agentsGrid}>
            {popularAgents.map(agent => (
              <div key={agent.id} className={styles.agentCard}>
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className={styles.agentImage} 
                />
                <div className={styles.agentInfo}>
                  <h3>{agent.name}</h3>
                  <div className={styles.agentMeta}>
                    <span>{agent.role}</span>
                    <span>Выбор: {agent.pickRate}</span>
                  </div>
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

export default ValorantPage;