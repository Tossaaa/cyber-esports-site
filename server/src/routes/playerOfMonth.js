const express = require('express');
const router = express.Router();
const playerOfMonthController = require('../controllers/playerOfMonthController');
const auth = require('../middleware/auth');

// Получить игрока месяца для конкретной игры
router.get('/:game', playerOfMonthController.getPlayerOfMonth);

// Создать нового игрока месяца (только для админов)
router.post('/', auth, playerOfMonthController.createPlayerOfMonth);

// Обновить игрока месяца (только для админов)
router.put('/:id', auth, playerOfMonthController.updatePlayerOfMonth);

// Удалить игрока месяца (только для админов)
router.delete('/:id', auth, playerOfMonthController.deletePlayerOfMonth);

module.exports = router; 