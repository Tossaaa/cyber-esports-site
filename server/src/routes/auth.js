const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Регистрация
router.post('/register', async (req, res) => {
    console.log('Register request received:', req.body);
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            console.log('Missing required fields:', { username, email, password: !!password });
            return res.status(400).json({ 
                success: false, 
                message: 'Необходимо указать имя пользователя, email и пароль' 
            });
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный формат email'
            });
        }

        console.log('Attempting to register user:', { username, email });
        const user = await userService.register(username, email, password);
        console.log('User registered successfully:', user);

        // Создаем токен
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Регистрация успешна', 
            user,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Вход
router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body);
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            console.log('Missing required fields:', { username, password: !!password });
            return res.status(400).json({ 
                success: false, 
                message: 'Необходимо указать email/имя пользователя и пароль' 
            });
        }

        console.log('Attempting to login user:', username);
        const user = await userService.login(username, password);
        console.log('User logged in successfully:', user);

        // Создаем токен
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            message: 'Вход выполнен успешно', 
            user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Маршрут для смены пароля
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Текущий и новый пароль обязательны' });
        }

        // Получаем пользователя из базы данных
        const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
        
        if (!user) {
            console.error('Пользователь не найден при смене пароля:', userId);
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Если у пользователя нет пароля, пропускаем проверку текущего пароля
        let isValidPassword = true;
        if (user.password) {
            isValidPassword = await bcrypt.compare(currentPassword, user.password);
        }
        
        if (!isValidPassword) {
            console.error('Неверный текущий пароль для пользователя:', userId);
            return res.status(400).json({ message: 'Неверный текущий пароль' });
        }

        // Хешируем новый пароль
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Обновляем пароль в базе данных
        await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        
        console.log('Пароль успешно изменен для пользователя:', userId);
        res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
        console.error('Ошибка при смене пароля:', error);
        res.status(500).json({ 
            message: 'Ошибка при смене пароля',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Маршрут для проверки данных пользователя
router.get('/check-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.get('SELECT id, username, email, password, role FROM users WHERE id = ?', [userId]);
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            hasPassword: !!user.password,
            role: user.role
        });
    } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
        res.status(500).json({ 
            message: 'Ошибка при проверке пользователя',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Маршрут для изменения имени пользователя
router.post('/change-username', authMiddleware, (req, res) => {
    console.log('Change username request received:', { body: req.body, user: req.user });
    
    const { newUsername } = req.body;
    const userId = req.user.id;

    if (!newUsername) {
        console.log('Missing newUsername in request');
        return res.status(400).json({ message: 'Новое имя пользователя обязательно' });
    }

    // Проверяем длину имени пользователя
    if (newUsername.length < 3 || newUsername.length > 30) {
        console.log('Invalid username length:', newUsername.length);
        return res.status(400).json({ message: 'Имя пользователя должно быть от 3 до 30 символов' });
    }

    // Получаем текущего пользователя
    console.log('Fetching current user data');
    db.get('SELECT username FROM users WHERE id = ?', [userId], (err, currentUser) => {
        if (err) {
            console.error('Database error fetching current user:', err);
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (!currentUser) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, не совпадает ли новое имя с текущим
        if (currentUser.username === newUsername) {
            console.log('New username matches current username');
            return res.status(400).json({ message: 'Новое имя совпадает с текущим' });
        }

        // Проверяем, не занято ли имя пользователя
        console.log('Checking if username is taken:', newUsername);
        db.get('SELECT id FROM users WHERE username = ? AND id != ?', [newUsername, userId], (err, existingUser) => {
            if (err) {
                console.error('Database error checking username:', err);
                return res.status(500).json({ message: 'Ошибка базы данных' });
            }

            if (existingUser) {
                console.log('Username is already taken:', newUsername);
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
            }

            // Обновляем имя пользователя
            console.log('Updating username for user:', userId);
            db.run('UPDATE users SET username = ? WHERE id = ?', [newUsername, userId], function(err) {
                if (err) {
                    console.error('Database error updating username:', err);
                    return res.status(500).json({ message: 'Ошибка при обновлении имени пользователя' });
                }

                // Получаем обновленные данные пользователя
                console.log('Fetching updated user data');
                db.get('SELECT id, username, email, role FROM users WHERE id = ?', [userId], (err, updatedUser) => {
                    if (err) {
                        console.error('Database error fetching updated user:', err);
                        return res.status(500).json({ message: 'Ошибка при получении обновленных данных' });
                    }

                    console.log('Username change successful:', { userId, newUsername });
                    res.json({ 
                        message: 'Имя пользователя успешно изменено',
                        user: updatedUser
                    });
                });
            });
        });
    });
});

// Маршрут для изменения email
router.post('/change-email', authMiddleware, (req, res) => {
    console.log('Change email request received:', { body: req.body, user: req.user });
    
    const { newEmail, password } = req.body;
    const userId = req.user.id;

    if (!newEmail || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'Новый email и текущий пароль обязательны' });
    }

    // Проверяем формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        console.log('Invalid email format:', newEmail);
        return res.status(400).json({ message: 'Некорректный формат email' });
    }

    // Получаем текущего пользователя
    console.log('Fetching current user data');
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Database error fetching user:', err);
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, не совпадает ли новый email с текущим
        if (user.email === newEmail) {
            console.log('New email matches current email');
            return res.status(400).json({ message: 'Новый email совпадает с текущим' });
        }

        // Проверяем пароль
        console.log('Verifying password');
        bcrypt.compare(password, user.password, (err, isValidPassword) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Ошибка при проверке пароля' });
            }

            if (!isValidPassword) {
                console.log('Invalid password provided');
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            // Проверяем, не занят ли email другим пользователем
            console.log('Checking if email is taken:', newEmail);
            db.get('SELECT id FROM users WHERE email = ? AND id != ?', [newEmail, userId], (err, existingUser) => {
                if (err) {
                    console.error('Database error checking email:', err);
                    return res.status(500).json({ message: 'Ошибка базы данных' });
                }

                if (existingUser) {
                    console.log('Email is already taken:', newEmail);
                    return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
                }

                // Обновляем email
                console.log('Updating email for user:', userId);
                db.run('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId], function(err) {
                    if (err) {
                        console.error('Database error updating email:', err);
                        return res.status(500).json({ message: 'Ошибка при обновлении email' });
                    }

                    // Получаем обновленные данные пользователя
                    console.log('Fetching updated user data');
                    db.get('SELECT id, username, email, role FROM users WHERE id = ?', [userId], (err, updatedUser) => {
                        if (err) {
                            console.error('Database error fetching updated user:', err);
                            return res.status(500).json({ message: 'Ошибка при получении обновленных данных' });
                        }

                        console.log('Email change successful:', { userId, newEmail });
                        res.json({ 
                            message: 'Email успешно изменен',
                            user: updatedUser
                        });
                    });
                });
            });
        });
    });
});

module.exports = router; 