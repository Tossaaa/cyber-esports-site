const db = require('../db');

// Добавление колонки game_tag в таблицу news
db.run(`
    ALTER TABLE news ADD COLUMN game_tag TEXT;
`, (err) => {
    if (err) {
        console.error('Ошибка при добавлении колонки game_tag:', err);
    } else {
        console.log('Колонка game_tag успешно добавлена в таблицу news');
    }
}); 