const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');
const db = require('../database/db');

// Получить все команды для конкретной игры
router.get('/:game', teamController.getTeams);

// Создать новую команду (только для админов)
router.post('/', auth, teamController.createTeam);

// Обновить команду (только для админов)
router.put('/:id', auth, teamController.updateTeam);

// Удалить команду (только для админов)
router.delete('/:id', auth, teamController.deleteTeam);

module.exports = router; 