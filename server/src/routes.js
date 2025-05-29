const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const newsController = require('./controllers/newsController');
const tournamentController = require('./controllers/tournamentController');
const teamController = require('./controllers/teamController');
const playerOfMonthController = require('./controllers/playerOfMonthController');
const { authenticateToken } = require('./middleware/auth');

// Маршруты аутентификации
router.post('/register', authController.register);
router.post('/login', authController.login);

// Маршруты новостей
router.get('/news/tag/:tag', newsController.getNewsByTag);
router.post('/news', authenticateToken, newsController.createNews);
router.put('/news/:id', authenticateToken, newsController.updateNews);
router.delete('/news/:id', authenticateToken, newsController.deleteNews);

// Маршруты турниров
router.get('/tournaments/game/:game', tournamentController.getTournamentsByGame);
router.post('/tournaments', authenticateToken, tournamentController.createTournament);
router.put('/tournaments/:id', authenticateToken, tournamentController.updateTournament);
router.delete('/tournaments/:id', authenticateToken, tournamentController.deleteTournament);

// Маршруты команд
router.get('/teams/:game', teamController.getTeams);
router.post('/teams', authenticateToken, teamController.createTeam);
router.put('/teams/:id', authenticateToken, teamController.updateTeam);
router.delete('/teams/:id', authenticateToken, teamController.deleteTeam);

// Маршруты игрока месяца
router.get('/player-of-month/:game', playerOfMonthController.getPlayerOfMonth);
router.put('/player-of-month/:id', authenticateToken, playerOfMonthController.updatePlayerOfMonth);

module.exports = router; 