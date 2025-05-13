const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Регистрация
router.post('/register', async (req, res) => {
    console.log('Register request received:', req.body);
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            console.log('Missing required fields:', { username, password: !!password });
            return res.status(400).json({ 
                success: false, 
                message: 'Необходимо указать имя пользователя и пароль' 
            });
        }

        console.log('Attempting to register user:', { username });
        const user = await userService.register(username, password);
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
                message: 'Необходимо указать имя пользователя и пароль' 
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

module.exports = router; 