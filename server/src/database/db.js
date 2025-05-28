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
        console.error('Error connecting to database:', err);
        throw new Error('Ошибка при подключении к базе данных: ' + err.message);
    }
    console.log('Connected to SQLite database');
    
    // Создаем таблицу пользователей, если она не существует
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
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created or already exists');
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

    // Создаем таблицу команд
    db.run(`
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            logo_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating teams table:', err);
        } else {
            console.log('Teams table created or already exists');
        }
    });

    // Создаем таблицу турниров
    db.run(`
        CREATE TABLE IF NOT EXISTS tournaments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            start_date DATETIME,
            end_date DATETIME,
            prize_pool TEXT,
            status TEXT DEFAULT 'upcoming',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating tournaments table:', err);
        } else {
            console.log('Tournaments table created or already exists');
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