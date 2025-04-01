import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/DisciplinePage.css';

const DisciplinePage = () => {
  const { id } = useParams();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Здесь нужно будет интегрировать данные с API или базы данных
    setMatches([
      { match: 'Team A vs Team B', time: '2025-04-02 19:00', result: '2-1' },
      { match: 'Team C vs Team D', time: '2025-04-03 20:00', result: '1-2' },
    ]);
  }, [id]);

  return (
    <div className="discipline-page">
      <h1>Дисциплина: {id === '1' ? 'CS2' : id === '2' ? 'Dota 2' : id === '3' ? 'PUBG' : 'Valorant'}</h1>
      <h2>Расписание матчей</h2>
      <div className="matches">
        {matches.map((match, index) => (
          <div key={index} className="match-card">
            <h3>{match.match}</h3>
            <p>Время: {match.time}</p>
            <p>Результат: {match.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisciplinePage;
