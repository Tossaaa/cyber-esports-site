const db = require('./db');

// Создание таблицы пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table created or already exists');
  }
});

// Функция для проверки существования таблицы
const checkTableExists = (tableName) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
  if (err) {
        reject(err);
  } else {
        resolve(!!row);
  }
});
  });
};

// Функция для получения структуры таблицы
const getTableInfo = (tableName) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
  if (err) {
        reject(err);
  } else {
        resolve(rows);
  }
});
  });
};

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

// Пересоздаем таблицу турниров
const recreateTournamentsTable = async () => {
  try {
    // Удаляем старую таблицу
    await runQuery('DROP TABLE IF EXISTS tournaments');
    
    // Создаем новую таблицу с расширенными полями
    await runQuery(`
      CREATE TABLE tournaments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        prize_pool TEXT,
        status TEXT DEFAULT 'Предстоящий' CHECK (status IN ('Предстоящий', 'Идет', 'Завершен')),
        organizer TEXT,
        location TEXT,
        format TEXT,
        max_teams INTEGER DEFAULT 16,
        rules TEXT,
        logo TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    console.log('Tournaments table recreated successfully');
  } catch (err) {
    console.error('Error recreating tournaments table:', err);
    throw err;
  }
};

// Инициализация базы данных
const initDatabase = async () => {
  console.log('Initializing database...');
  
  try {
    // Создаем таблицу пользователей
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');

    // Пересоздаем таблицу турниров
    await recreateTournamentsTable();

    // Создаем связующую таблицу турниров и команд
    await runQuery(`
      CREATE TABLE IF NOT EXISTS tournament_teams (
        tournament_id INTEGER NOT NULL,
        team_id INTEGER NOT NULL,
        PRIMARY KEY (tournament_id, team_id),
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
      )
    `);
    console.log('Tournament teams table created or already exists');

    // Создаем таблицу команд
    await runQuery(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        logo TEXT,
        points INTEGER DEFAULT 0 CHECK (points <= 1000),
        country TEXT,
        founded TEXT,
        game TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    console.log('Teams table created or already exists');

    // Проверяем существование таблиц
    const tables = ['tournaments', 'tournament_teams', 'teams'];
    for (const table of tables) {
      const exists = await checkTableExists(table);
      console.log(`Таблица ${table} существует:`, exists);
      if (exists) {
        const info = await getTableInfo(table);
        console.log(`Структура таблицы ${table}:`, info);
      }
    }

    // Проверяем наличие тестовых команд
    const countResult = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM teams', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (countResult.count === 0) {
      console.log('Добавляем тестовые команды...');
        const now = new Date().toISOString();
      const testTeams = [
        ['Natus Vincere', '/uploads/teams/navi.png', 950, 'Украина', '2009', 'cs2'],
        ['FaZe Clan', '/uploads/teams/faze.png', 900, 'Европа', '2016', 'cs2'],
        ['Team Spirit', '/uploads/teams/spirit.png', 850, 'Россия', '2015', 'cs2']
      ];

      for (const team of testTeams) {
        await runQuery(`
          INSERT INTO teams (
            name, logo, points, country, founded, game, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [...team, now, now]);
      }
      console.log('Test teams inserted successfully');
          } else {
      console.log('Test teams already exist');
          }

    console.log('Database initialization completed successfully');
  } catch (err) {
    console.error('Ошибка при инициализации базы данных:', err);
    throw err;
  }
};

module.exports = { initDatabase }; 