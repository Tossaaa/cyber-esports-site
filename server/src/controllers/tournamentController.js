const db = require('../database/db');

// Функция для выполнения SQL-запроса
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

// Функция для получения данных
const getData = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Получить все турниры с командами
const getTournaments = async (req, res) => {
  try {
    const tournaments = await getData('SELECT * FROM tournaments ORDER BY start_date DESC');
    
    if (tournaments.length === 0) {
      return res.json([]);
    }

    const tournamentsWithTeams = await Promise.all(
      tournaments.map(async (tournament) => {
        const teams = await getData(
          `SELECT teams.* FROM teams
           JOIN tournament_teams ON teams.id = tournament_teams.team_id
           WHERE tournament_teams.tournament_id = ?`,
          [tournament.id]
        );
        return { ...tournament, teams };
      })
    );

    res.json(tournamentsWithTeams);
  } catch (err) {
    console.error('Ошибка при получении турниров:', err);
    res.status(500).json({ message: 'Ошибка при получении турниров' });
  }
};

// Создать турнир с выбранными командами
const createTournament = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      prizePool,
      teams,
      format,
      location,
      organizer,
      rules,
      logo
    } = req.body;

    // Проверка обязательных полей
    if (!name || !description || !startDate || !endDate || !prizePool || !teams || !format || !location || !organizer || !rules) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    // Проверка дат
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ message: 'Дата начала не может быть в прошлом' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'Дата окончания должна быть позже даты начала' });
    }

    // Определение статуса турнира
    let status = 'Предстоящий';
    if (now >= start && now <= end) {
      status = 'Идет';
    } else if (now > end) {
      status = 'Завершен';
    }

    // Проверка существования команд
    if (Array.isArray(teams) && teams.length > 0) {
      const placeholders = teams.map(() => '?').join(',');
      const existingTeams = await getData(
        `SELECT id FROM teams WHERE id IN (${placeholders})`,
        teams
      );

      if (existingTeams.length !== teams.length) {
        return res.status(400).json({ message: 'Одна или несколько указанных команд не существуют' });
      }
    }

    // Создание турнира
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const result = await runQuery(
      `INSERT INTO tournaments (
        name, start_date, end_date, prize_pool, 
        status, organizer, location, format, rules, logo, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, startDate, endDate, prizePool,
        status, organizer, location, format, rules, logo, created_at, updated_at
      ]
    );

    const tournamentId = result.lastID;

    // Добавление команд к турниру
    if (Array.isArray(teams) && teams.length > 0) {
      // Удаляем дубликаты из массива команд
      const uniqueTeams = [...new Set(teams)];
      
      // Сначала удаляем все существующие связи команд с турниром
      await runQuery(
        'DELETE FROM tournament_teams WHERE tournament_id = ?',
        [tournamentId]
      );
      
      const placeholders = uniqueTeams.map(() => '(?, ?)').join(',');
      const values = [];
      uniqueTeams.forEach(teamId => {
        values.push(tournamentId, teamId);
      });

      await runQuery(
        `INSERT INTO tournament_teams (tournament_id, team_id) VALUES ${placeholders}`,
        values
      );
    }

    // Получение созданного турнира с командами
    const [tournament] = await getData('SELECT * FROM tournaments WHERE id = ?', [tournamentId]);
    const tournamentTeams = await getData(
      `SELECT teams.* FROM teams
       JOIN tournament_teams ON teams.id = tournament_teams.team_id
       WHERE tournament_teams.tournament_id = ?`,
      [tournamentId]
    );

    res.status(201).json({ ...tournament, teams: tournamentTeams });
  } catch (err) {
    console.error('Ошибка при создании турнира:', err);
    res.status(500).json({ message: 'Ошибка при создании турнира', error: err.message });
  }
};

module.exports = {
  getTournaments,
  createTournament
}; 