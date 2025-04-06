import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/DotaPage.module.css';
import { FiArrowLeft, FiCalendar, FiAward, FiUsers, FiZap } from 'react-icons/fi';

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
      {/* Хедер */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.backButton}>
            <FiArrowLeft className={styles.backIcon} />
            <span className={styles.backText}>На главную</span>
          </Link>
          <div className={styles.titleContainer}>
            <img src="/images/dota2-logo.png" alt="Dota 2 Logo" className={styles.gameLogo} />
            <h1 className={styles.title}>DOTA 2</h1>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className={styles.container}>
        {/* Баннер */}
        <div className={`${styles.hero} ${styles.dotaHero}`}>
          <div className={styles.heroContent}>
            <div className={styles.gameInfo}>
              <h2>Dota 2</h2>
              <p>Командная MOBA-игра с самой большой киберспортивной сценой</p>
              <div className={styles.metaInfo}>
                <span><FiZap /> Самый большой призовой фонд в киберспорте</span>
                <span>Разработчик: Valve</span>
                <span>Платформы: Windows, Linux, Mac</span>
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
    </div>
  );
};

export default DotaPage;