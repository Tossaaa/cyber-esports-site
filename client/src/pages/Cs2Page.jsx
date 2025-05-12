import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/CS2Page.module.css';
import { FiArrowLeft, FiCalendar, FiAward, FiUsers, FiTrendingUp, FiBarChart2, FiTarget } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cs2Page = () => {
  // Пример данных (можно заменить на реальные из API)
  const tournamentData = [
    {
      id: 1,
      name: 'PGL Major Copenhagen 2024',
      date: '21 марта - 3 апреля 2024',
      prize: '$1,250,000',
      teams: 24,
      status: 'Завершен'
    },
    {
      id: 2,
      name: 'IEM Katowice 2024',
      date: '31 января - 12 февраля 2024',
      prize: '$1,000,000',
      teams: 24,
      status: 'Завершен'
    },
    {
      id: 3,
      name: 'BLAST Premier World Final 2024',
      date: '12-17 декабря 2024',
      prize: '$1,000,000',
      teams: 8,
      status: 'Предстоящий'
    }
  ];

  const topTeams = [
    { id: 1, name: 'Team Spirit', rank: 1, points: 1200 },
    { id: 2, name: 'Natus Vincere', rank: 2, points: 1100 },
    { id: 3, name: 'Virtus.pro', rank: 3, points: 1050 },
    { id: 4, name: 'FaZe Clan', rank: 4, points: 1000 },
    { id: 5, name: 'G2 Esports', rank: 5, points: 950 }
  ];

  const statsData = {
    activePlayers: '1.2M',
    tournaments: '156',
    totalPrize: '$12.5M',
    topWeapon: 'AK-47',
    topMap: 'Dust II',
    avgMatchTime: '35 мин'
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      
      {/* Основной контент */}
      <div className={styles.container}>
        {/* Баннер дисциплины */}
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <div className={styles.gameInfo}>
              <h2>Counter-Strike 2</h2>
              <p>Тактический шутер от первого лица, развивающийся с 2012 года</p>
              <div className={styles.metaInfo}>
                <span>Разработчик: Valve</span>
                <span>Жанр: FPS</span>
                <span>Платформы: Windows, Linux</span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Статистика CS2</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <FiUsers className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Активных игроков</h3>
                <p>{statsData.activePlayers}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FiAward className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Турниров в 2024</h3>
                <p>{statsData.tournaments}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FiTrendingUp className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Призовой фонд</h3>
                <p>{statsData.totalPrize}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FiTarget className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Популярное оружие</h3>
                <p>{statsData.topWeapon}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FiBarChart2 className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Лучшая карта</h3>
                <p>{statsData.topMap}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FiCalendar className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3>Среднее время матча</h3>
                <p>{statsData.avgMatchTime}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Разделы страницы */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ближайшие турниры</h2>
          <div className={styles.tournaments}>
            {tournamentData.map(tournament => (
              <div key={tournament.id} className={`${styles.tournamentCard} ${tournament.status === 'Предстоящий' ? styles.upcoming : ''}`}>
                <h3>{tournament.name}</h3>
                <div className={styles.tournamentMeta}>
                  <span><FiCalendar /> {tournament.date}</span>
                  <span><FiAward /> {tournament.prize}</span>
                  <span><FiUsers /> {tournament.teams} команд</span>
                </div>
                <div className={`${styles.status} ${tournament.status === 'Предстоящий' ? styles.upcomingStatus : ''}`}>
                  {tournament.status}
                </div>
                <Link to={`/tournament/${tournament.id}`} className={styles.detailsLink}>
                  Подробнее →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Топ команд</h2>
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

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Последние новости</h2>
          <div className={styles.newsGrid}>
            <div className={styles.newsCard}>
              <img src="/images/cs2-news1.jpg" alt="Новость CS2" />
              <div className={styles.newsContent}>
                <h3>Обновление карт в CS2</h3>
                <p>Valve представила обновленные версии Dust2 и Mirage</p>
                <span className={styles.newsDate}>2 дня назад</span>
              </div>
            </div>
            <div className={styles.newsCard}>
              <img src="/images/cs2-news2.jpg" alt="Новость CS2" />
              <div className={styles.newsContent}>
                <h3>Новый чемпионат ESL</h3>
                <p>Анонсирован ESL Pro League Season 19 с призовым фондом $1,000,000</p>
                <span className={styles.newsDate}>5 дней назад</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Cs2Page;