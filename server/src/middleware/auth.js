const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Требуется авторизация' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Получаем пользователя из базы данных SQLite
        db.get('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.userId], (err, user) => {
            if (err) {
                console.error('Database error in auth middleware:', err);
                return res.status(500).json({ message: 'Ошибка базы данных' });
            }
            
            if (!user) {
                return res.status(401).json({ message: 'Пользователь не найден' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Недействительный токен' });
    }
};

module.exports = auth; 