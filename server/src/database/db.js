const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Создаем директорию для базы данных, если она не существует
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'database.sqlite');
console.log('Database path:', dbPath);

// Создаем подключение к базе данных
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных:', err);
    } else {
        console.log('Подключение к базе данных установлено');
    }
});

// Включаем поддержку внешних ключей
db.run('PRAGMA foreign_keys = ON');

// Создаем таблицу пользователей
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('Ошибка при создании таблицы users:', err);
    } else {
        console.log('Таблица users создана или уже существует');
    }
});

// Создаем таблицу команд
db.run(`
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
`, (err) => {
    if (err) {
        console.error('Ошибка при создании таблицы teams:', err);
    } else {
        console.log('Таблица teams создана или уже существует');
    }
});

// Создаем таблицу новостей, если она не существует
db.run(`
    CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        image_url TEXT,
        author_id INTEGER,
        game_tag TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
    )
`, (err) => {
    if (err) {
        console.error('Ошибка при создании таблицы новостей:', err);
    } else {
        console.log('Таблица новостей создана или уже существует');
    }
});

// Создаем таблицу игроков
db.run(`
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT NOT NULL,
        real_name TEXT,
        team_id INTEGER,
        role TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id)
    )
`, (err) => {
    if (err) {
        console.error('Error creating players table:', err);
    } else {
        console.log('Players table created or already exists');
    }
});

// Создаем таблицу игрока месяца
db.run(`
    CREATE TABLE IF NOT EXISTS player_of_month (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        role TEXT NOT NULL,
        image TEXT NOT NULL,
        kills INTEGER NOT NULL,
        headshots INTEGER NOT NULL,
        rating REAL NOT NULL,
        mvp INTEGER NOT NULL,
        game TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('Error creating player_of_month table:', err);
    } else {
        console.log('Player of month table created or already exists');
    }
});

// Создание связующей таблицы турниров и команд
db.run(`CREATE TABLE IF NOT EXISTS tournament_teams (
    tournament_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    PRIMARY KEY (tournament_id, team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
)`, (err) => {
    if (err) {
        console.error('Ошибка при создании таблицы tournament_teams:', err);
    } else {
        console.log('Таблица tournament_teams создана или уже существует');
    }
});

// Обработка ошибок базы данных
db.on('error', (err) => {
    console.error('Database error:', err);
});

// Закрытие соединения при завершении работы приложения
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = db; 