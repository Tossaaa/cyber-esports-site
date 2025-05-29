// Инициализация базы данных
const initDatabase = () => {
  // Проверяем существование таблиц и создаем их, если они не существуют
  db.serialize(() => {
    // Создаем таблицу для игроков месяца
    db.run(`
      CREATE TABLE IF NOT EXISTS player_of_month (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        role TEXT NOT NULL,
        image TEXT,
        kills INTEGER,
        headshots INTEGER,
        rating REAL,
        mvp INTEGER,
        game TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Создаем таблицу для команд
    db.run(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        logo TEXT,
        points INTEGER DEFAULT 0,
        country TEXT,
        founded TEXT,
        game TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Проверяем, есть ли уже данные в таблицах
    db.get('SELECT COUNT(*) as count FROM player_of_month', (err, row) => {
      if (err) {
        console.error('Error checking player_of_month table:', err);
        return;
      }

      // Если таблица пуста, добавляем тестовые данные
      if (row.count === 0) {
        const now = new Date().toISOString();
        db.run(`
          INSERT INTO player_of_month (
            name, team, role, image, kills, headshots, rating, mvp, game, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          's1mple',
          'Natus Vincere',
          'AWPer',
          '/uploads/players/s1mple.jpg',
          250,
          65,
          1.35,
          3,
          'cs2',
          now,
          now
        ], (err) => {
          if (err) {
            console.error('Error inserting test player:', err);
          } else {
            console.log('Test player inserted successfully');
          }
        });
      }
    });

    // Проверяем наличие команд
    db.get('SELECT COUNT(*) as count FROM teams', (err, row) => {
      if (err) {
        console.error('Error checking teams table:', err);
        return;
      }

      // Если таблица пуста, добавляем тестовые команды
      if (row.count === 0) {
        const now = new Date().toISOString();
        const testTeams = [
          ['Natus Vincere', '/uploads/teams/navi.png', 1200, 'Украина', '2009', 'cs2'],
          ['FaZe Clan', '/uploads/teams/faze.png', 1150, 'Европа', '2016', 'cs2'],
          ['Team Spirit', '/uploads/teams/spirit.png', 1100, 'Россия', '2015', 'cs2']
        ];

        const stmt = db.prepare(`
          INSERT INTO teams (
            name, logo, points, country, founded, game, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        testTeams.forEach(team => {
          stmt.run([...team, now, now], (err) => {
            if (err) {
              console.error('Error inserting test team:', err);
            }
          });
        });

        stmt.finalize();
        console.log('Test teams inserted successfully');
      }
    });
  });
};

module.exports = { initDatabase }; 