const db = require('../database/db');
const bcrypt = require('bcryptjs');

class UserService {
    // Регистрация пользователя
    register(username, email, password) {
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
                        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                        [username, email, hashedPassword, role],
                        function(err) {
                            if (err) {
                                if (err.message.includes('UNIQUE constraint failed')) {
                                    if (err.message.includes('users.email')) {
                                        reject(new Error('Пользователь с таким email уже существует'));
                                    } else {
                                        reject(new Error('Пользователь с таким именем уже существует'));
                                    }
                                } else {
                                    reject(err);
                                }
                                return;
                            }
                            resolve({ id: this.lastID, username, email, role });
                        }
                    );
                });
            });
        });
    }

    // Вход пользователя
    login(username, password) {
        return new Promise((resolve, reject) => {
            // Проверяем, является ли username email'ом
            const isEmail = username.includes('@');
            const query = isEmail 
                ? 'SELECT * FROM users WHERE email = ?'
                : 'SELECT * FROM users WHERE username = ?';

            db.get(query, [username], (err, user) => {
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
                        email: user.email,
                        role: user.role || 'user'
                    });
                });
            });
        });
    }

    // Получение пользователя по ID
    getUserById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, email, role FROM users WHERE id = ?',
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