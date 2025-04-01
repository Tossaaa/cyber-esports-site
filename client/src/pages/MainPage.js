import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css'; // Подключаем стили

function MainPage() {
  const disciplines = [
    { name: 'CS2', image: '/images/cs2.jpg', link: '/discipline/cs2' },
    { name: 'Dota 2', image: '/images/dota2.jpg', link: '/discipline/dota2' },
    { name: 'PUBG', image: '/images/pubg.jpg', link: '/discipline/pubg' },
    { name: 'Valorant', image: '/images/valorant.jpg', link: '/discipline/valorant' },
  ];

  return (
    <div className="main-page">
      <h1>Welcome to the Cyber Esports Site</h1>
      <h2>Select a Discipline</h2>
      <div className="disciplines">
        {disciplines.map((discipline, index) => (
          <Link key={index} to={discipline.link} className="discipline-card">
            <img src={discipline.image} alt={discipline.name} />
            <h3>{discipline.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
