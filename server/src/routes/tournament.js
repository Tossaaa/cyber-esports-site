const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const jwt = require('jsonwebtoken');

// Middleware для проверки JWT токена
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('Отсутствует токен авторизации');
      return res.status(401).json({ message: 'Необходима авторизация' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Токен успешно проверен:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Ошибка при проверке токена:', err);
    return res.status(401).json({ message: 'Недействительный токен авторизации' });
  }
};

// Получить все турниры
router.get('/', tournamentController.getTournaments);

// Создать турнир (требуется авторизация)
router.post('/', authMiddleware, (req, res, next) => {
  console.log('Получен запрос на создание турнира:', {
    body: req.body,
    headers: req.headers,
    user: req.user
  });
  tournamentController.createTournament(req, res, next);
});

module.exports = router; 