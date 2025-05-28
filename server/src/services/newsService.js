const db = require('../database/db');

class NewsService {
    // Получение всех новостей
    getAllNews() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT n.*, u.username as author_name 
                FROM news n 
                LEFT JOIN users u ON n.author_id = u.id 
                ORDER BY n.created_at DESC
            `, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    // Получение новости по ID
    getNewsById(id) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT n.*, u.username as author_name 
                FROM news n 
                LEFT JOIN users u ON n.author_id = u.id 
                WHERE n.id = ?
            `, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    // Создание новой новости
    createNews(newsData) {
        return new Promise((resolve, reject) => {
            const { title, description, content, image_url, author_id, game_tag } = newsData;
            db.run(`
                INSERT INTO news (title, description, content, image_url, author_id, game_tag)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [title, description, content, image_url, author_id, game_tag], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id: this.lastID, ...newsData });
            });
        });
    }

    // Обновление новости
    updateNews(id, newsData) {
        return new Promise((resolve, reject) => {
            const { title, description, content, image_url, game_tag } = newsData;
            db.run(`
                UPDATE news 
                SET title = ?, description = ?, content = ?, image_url = ?, game_tag = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [title, description, content, image_url, game_tag, id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id, ...newsData });
            });
        });
    }

    // Удаление новости
    deleteNews(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id });
            });
        });
    }

    // Получение новостей по тегу
    getNewsByTag(tag) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT n.*, u.username as author_name 
                FROM news n 
                LEFT JOIN users u ON n.author_id = u.id 
                WHERE n.game_tag = ?
                ORDER BY n.created_at DESC
            `, [tag], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }
}

module.exports = new NewsService(); 