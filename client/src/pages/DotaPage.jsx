import React from 'react';
import styles from '../styles/DotaPage.module.css';
import { FiCalendar, FiAward, FiUsers } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DotaPage = () => {
  // Данные турниров
  const tournamentData = [
    {
      id: 1,
      name: 'The International 2024',
      date: '15-25 октября 2024',
      prize: '$20,000,000',
      teams: 18,
      status: 'Предстоящий',
    },
    {
      id: 2,
      name: 'Riyadh Masters 2024',
      date: '10-21 июля 2024',
      prize: '$5,000,000',
      teams: 16,
      status: 'Завершен'
    },
    {
      id: 3,
      name: 'DreamLeague Season 23',
      date: '18-28 мая 2024',
      prize: '$1,000,000',
      teams: 12,
      status: 'Завершен'
    }
  ];

  // Топ команд
  const topTeams = [
    { id: 1, name: 'Team Spirit', rank: 1, points: 1500 },
    { id: 2, name: 'PSG.LGD', rank: 2, points: 1450 },
    { id: 3, name: 'GG', rank: 3, points: 1400 },
    { id: 4, name: 'Team Falcons', rank: 4, points: 1350 },
    { id: 5, name: 'XG', rank: 5, points: 1300 }
  ];

  // Популярные герои
  const popularHeroes = [
    { id: 1, name: 'Pudge', pickRate: '28%', image: '/images/pudge.jpg' },
    { id: 2, name: 'Invoker', pickRate: '22%', image: '/images/invoker.jpg' },
    { id: 3, name: 'Juggernaut', pickRate: '20%', image: '/images/juggernaut.jpg' }
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
              <h2>Dota 2</h2>
              <p>Многопользовательская командная игра в жанре MOBA</p>
              <div className={styles.metaInfo}>
                <span>Разработчик: Valve</span>
                <span>Жанр: MOBA</span>
                <span>Платформы: Windows, Linux, macOS</span>
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
                {/* Бейдж "Главный турнир" */}
                {tournament.featured && 
                  <div className={styles.featuredBadge}>Главный турнир</div>
                }

                <h3>{tournament.name}</h3>
                
                <div className={styles.tournamentMeta}>
                  <span><FiCalendar /> {tournament.date}</span>
                  <span><FiAward /> {tournament.prize}</span>
                  <span><FiUsers /> {tournament.teams} команд</span>
                </div>

                {/* Плашка статуса с разными классами */}
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
              <span>Очки DPC</span>
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

        {/* Популярные герои */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Популярные герои</h2>
          <div className={styles.heroesGrid}>
            {popularHeroes.map(hero => (
              <div key={hero.id} className={styles.heroCard}>
                <img src={hero.image} alt={hero.name} className={styles.heroImage} />
                <div className={styles.heroInfo}>
                  <h3>{hero.name}</h3>
                  <p>Частота выбора: {hero.pickRate}</p>
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

export default DotaPage;