const fs = require('fs');
const path = require('path');
const db = require('./db');

const migrationsDir = path.join(__dirname, 'migrations');

// Получаем список всех файлов миграций
const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js'))
    .sort();

// Выполняем каждую миграцию
migrationFiles.forEach(file => {
    console.log(`Running migration: ${file}`);
    require(path.join(migrationsDir, file));
});

// Закрываем соединение с базой данных после выполнения всех миграций
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        } else {
            console.log('Database connection closed');
        }
    });
}, 1000); 