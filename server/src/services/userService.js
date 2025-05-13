const db = require('../database/db');
const bcrypt = require('bcryptjs');

class UserService {
    // Регистрация пользователя
    register(username, password) {
        return new Promise((resolve, reject) => {
            // Хешируем пароль
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Проверяем, есть ли уже пользователи в базе
                db.get('SELECT COUNT(*) as count FROM users', [], (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Если это первый пользователь, делаем его админом
                    const role = result.count === 0 ? 'admin' : 'user';

                    // Сохраняем пользователя в базу данных
                    db.run(
                        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                        [username, hashedPassword, role],
                        function(err) {
                            if (err) {
                                if (err.message.includes('UNIQUE constraint failed')) {
                                    reject(new Error('Пользователь с таким именем уже существует'));
                                } else {
                                    reject(err);
                                }
                                return;
                            }
                            resolve({ id: this.lastID, username, role });
                        }
                    );
                });
            });
        });
    }

    // Вход пользователя
    login(username, password) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, user) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!user) {
                        reject(new Error('Пользователь не найден'));
                        return;
                    }

                    // Проверяем пароль
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!isMatch) {
                            reject(new Error('Неверный пароль'));
                            return;
                        }
                        resolve({ 
                            id: user.id, 
                            username: user.username,
                            role: user.role || 'user'
                        });
                    });
                }
            );
        });
    }

    // Получение пользователя по ID
    getUserById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, role FROM users WHERE id = ?',
                [id],
                (err, user) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!user) {
                        reject(new Error('Пользователь не найден'));
                        return;
                    }
                    resolve(user);
                }
            );
        });
    }
}

module.exports = new UserService(); 