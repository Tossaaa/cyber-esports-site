import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/MainPage.module.css";
import logo from "../assets/logo.png";
import { FiSearch, FiUser, FiLogIn, FiArrowRight } from "react-icons/fi";

const disciplines = [
  { id: "cs2", name: "CS2", image: "/images/cs2.jpg", bgColor: "#2a475e" },
  { id: "dota", name: "Dota 2", image: "/images/dota2.jpg", bgColor: "#1e3d6b" },
  { id: "pubg", name: "PUBG", image: "/images/pubg.jpg", bgColor: "#3a5a78" },
  { id: "valorant", name: "Valorant", image: "/images/valorant.jpg", bgColor: "#fa4454" },
];

const news = [
  { 
    title: "Обновление в CS2", 
    description: "Valve выпустили новый патч с картами и балансом оружия", 
    date: "2 часа назад"
  },
  { 
    title: "TI 2025 объявлен", 
    description: "The International по Dota 2 пройдет в октябре в Стокгольме", 
    date: "Вчера"
  },
];

const MainPage = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Шапка с полной шириной */}
      <div className={styles.headerWrapper}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <Link to="/">
                <img src={logo} alt="Logo" className={styles.logo} />
              </Link>
              <nav className={styles.nav}>
                <Link to="/tournaments" className={styles.navLink}>Турниры</Link>
                <Link to="/teams" className={styles.navLink}>Команды</Link>
                <Link to="/stats" className={styles.navLink}>Статистика</Link>
              </nav>
            </div>
            
            <div className={`${styles.searchContainer} ${searchFocused ? styles.focused : ''}`}>
              <FiSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Поиск турниров, команд..." 
                className={styles.search}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            <div className={styles.auth}>
              <button className={`${styles.button} ${styles.login}`}>
                <FiLogIn /> Войти
              </button>
              <button className={`${styles.button} ${styles.register}`}>
                <FiUser /> Регистрация
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.container}>
        {/* Герой-секция */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Киберспортивные турниры</h1>
            <p>Следите за результатами, статистикой и расписанием киберспортивных событий</p>
            <button className={styles.heroButton}>
              Ближайшие турниры <FiArrowRight />
            </button>
          </div>
        </section>

        {/* Карточки дисциплин */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Популярные дисциплины</h2>
            <Link to="/disciplines" className={styles.viewAll}>
              Все дисциплины <FiArrowRight />
            </Link>
          </div>
          <div className={styles.disciplinesGrid}>
            {disciplines.map((discipline) => (
              <Link 
                key={discipline.id} 
                to={`/discipline/${discipline.id}`} 
                className={styles.disciplineCard}
                style={{ '--card-bg': discipline.bgColor }}
              >
                <div className={styles.cardImageContainer}>
                  <img src={discipline.image} alt={discipline.name} className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{discipline.name}</h3>
                  <div className={styles.cardMeta}>
                    <span>12 активных турниров</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Новости */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Последние новости</h2>
            <Link to="/news" className={styles.viewAll}>
              Все новости <FiArrowRight />
            </Link>
          </div>
          <div className={styles.newsGrid}>
            {news.map((article, index) => (
              <article key={index} className={styles.newsCard}>
                {/* Условный рендеринг изображения */}
                {article.image && (
                  <div className={styles.newsImageContainer}>
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className={styles.newsImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className={styles.newsContent}>
                  <span className={styles.newsDate}>{article.date}</span>
                  <h3 className={styles.newsTitle}>{article.title}</h3>
                  <p className={styles.newsDescription}>{article.description}</p>
                  <Link to={`/news/${index}`} className={styles.readMore}>
                    Читать далее <FiArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Футер */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <Link to="/" className={styles.footerLogo}>
              <img src={logo} alt="Логотип" className={styles.logoImage} />
            </Link>
            <p className={styles.footerDescription}>
              Киберспортивная платформа для отслеживания турниров и статистики
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linksColumn}>
              <h4 className={styles.linksTitle}>Разделы</h4>
              <nav className={styles.linksList}>
                <Link to="/tournaments" className={styles.footerLink}>Турниры</Link>
                <Link to="/teams" className={styles.footerLink}>Команды</Link>
                <Link to="/stats" className={styles.footerLink}>Статистика</Link>
                <Link to="/news" className={styles.footerLink}>Новости</Link>
              </nav>
            </div>
            <div className={styles.linksColumn}>
              <h4 className={styles.linksTitle}>Поддержка</h4>
              <nav className={styles.linksList}>
                <Link to="/help" className={styles.footerLink}>Помощь</Link>
                <Link to="/faq" className={styles.footerLink}>FAQ</Link>
                <Link to="/contact" className={styles.footerLink}>Контакты</Link>
                <Link to="/privacy" className={styles.footerLink}>Политика</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2025 Esports Platform. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;