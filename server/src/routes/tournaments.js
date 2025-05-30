const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');

// Получение всех турниров
router.get('/', async (req, res) => {
  try {
        console.log('GET /api/tournaments - Query params:', req.query);
    const { game, status } = req.query;
        
        let query = `
            SELECT t.*, 
                   GROUP_CONCAT(tt.team_id) as team_ids,
                   GROUP_CONCAT(teams.name) as team_names
            FROM tournaments t
            LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
            LEFT JOIN teams ON tt.team_id = teams.id
        `;
        const params = [];

        if (game) {
            query += ' WHERE t.game = ?';
            params.push(game);
        }
        
        if (status) {
            query += game ? ' AND t.status = ?' : ' WHERE t.status = ?';
            params.push(status);
        }
        
        query += ' GROUP BY t.id';
        
        console.log('Executing query:', query, 'with params:', params);
        
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    message: 'Ошибка при получении турниров',
                    error: err.message 
                });
            }
            
            // Преобразуем строки с ID и именами команд в массивы
            const tournaments = rows.map(tournament => ({
                ...tournament,
                teams: tournament.team_ids ? tournament.team_ids.split(',').map((id, index) => ({
                    id: parseInt(id),
                    name: tournament.team_names.split(',')[index]
                })) : []
            }));
            
            console.log('Tournaments found:', tournaments);
    res.json(tournaments);
        });
  } catch (error) {
        console.error('Server error in GET /tournaments:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера при получении турниров',
            error: error.message 
        });
  }
});

// Получение турнира по ID
router.get('/:id', async (req, res) => {
  try {
        console.log('GET /api/tournaments/:id - ID:', req.params.id);
        
        db.get('SELECT * FROM tournaments WHERE id = ?', [req.params.id], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    message: 'Ошибка при получении турнира',
                    error: err.message 
                });
            }
            if (!row) {
                return res.status(404).json({ message: 'Турнир не найден' });
            }
            console.log('Tournament found:', row);
            res.json(row);
        });
    } catch (error) {
        console.error('Server error in GET /tournaments/:id:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера при получении турнира',
            error: error.message 
        });
    }
});

// Создание нового турнира
router.post('/', auth, async (req, res) => {
    try {
        console.log('Получен запрос на создание турнира:', {
            body: req.body,
            headers: req.headers,
            user: req.user
        });
        
        const { 
            name, 
            description, 
            game, 
            start_date, 
            end_date, 
            prize_pool, 
            location, 
            organizer, 
            format,
            teams
        } = req.body;

        // Проверяем обязательные поля
        const requiredFields = ['name', 'game', 'start_date', 'end_date', 'prize_pool'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.error('Отсутствуют обязательные поля:', missingFields);
            return res.status(400).json({ 
                message: 'Все поля обязательны для заполнения',
                missingFields: missingFields
            });
        }

        // Проверяем даты
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (startDate < now) {
            return res.status(400).json({
                message: 'Дата начала не может быть в прошлом'
            });
        }

        if (endDate <= startDate) {
            return res.status(400).json({
                message: 'Дата окончания должна быть позже даты начала'
            });
        }
        
        const query = `
            INSERT INTO tournaments (
                name, description, game, start_date, end_date, prize_pool, 
                location, organizer, format
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            name, 
            description || '', 
            game, 
            start_date, 
            end_date, 
            prize_pool, 
            location || '', 
            organizer || '', 
            format || 'BO1'
        ];
        
        console.log('Выполняем SQL запрос:', {
            query,
            params
        });
        
        db.run(query, params, function(err) {
            if (err) {
                console.error('Ошибка базы данных:', err);
                return res.status(500).json({ 
                    message: 'Ошибка при создании турнира',
                    error: err.message 
                });
  }

            const tournamentId = this.lastID;
            console.log('Турнир создан с ID:', tournamentId);

            // Если есть команды, добавляем их в связующую таблицу
            if (teams && teams.length > 0) {
                const teamQuery = `
                    INSERT INTO tournament_teams (tournament_id, team_id)
                    VALUES (?, ?)
                `;
                
                console.log('Добавляем команды в турнир:', {
                    tournamentId,
                    teams
                });
                
                // Добавляем каждую команду отдельным запросом
                const addTeamPromises = teams.map(teamId => {
                    return new Promise((resolve, reject) => {
                        db.run(teamQuery, [tournamentId, teamId], function(err) {
                            if (err) {
                                console.error(`Ошибка при добавлении команды ${teamId} в турнир:`, err);
                                reject(err);
                            } else {
                                console.log(`Команда ${teamId} успешно добавлена в турнир`);
                                resolve();
                            }
                        });
                    });
                });

                // Ждем завершения всех операций
                Promise.all(addTeamPromises)
                    .then(() => {
                        console.log('Все команды успешно добавлены в турнир');
                        res.status(201).json({ 
                            id: tournamentId,
                            message: 'Турнир успешно создан'
                        });
                    })
                    .catch(error => {
                        console.error('Ошибка при добавлении команд в турнир:', error);
                        res.status(500).json({ 
                            message: 'Турнир создан, но возникла ошибка при добавлении команд',
                            error: error.message 
                        });
                    });
            } else {
                res.status(201).json({ 
                    id: tournamentId,
                    message: 'Турнир успешно создан'
                });
            }
        });
  } catch (error) {
        console.error('Ошибка сервера при создании турнира:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера при создании турнира',
            error: error.message 
        });
  }
});

// Обновление турнира
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('PUT /api/tournaments/:id - ID:', req.params.id, 'Body:', req.body);
    
    const { 
      name, 
      description, 
      game, 
      start_date, 
      end_date, 
      prize_pool, 
      location, 
      organizer, 
      format,
      teams
    } = req.body;
    
    // Начинаем транзакцию
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Обновляем основную информацию о турнире
      const updateQuery = `
        UPDATE tournaments 
        SET name = ?, description = ?, game = ?, start_date = ?, end_date = ?, 
            prize_pool = ?, location = ?, organizer = ?, format = ?
        WHERE id = ?
      `;
      
      const params = [
        name, 
        description, 
        game, 
        start_date, 
        end_date, 
        prize_pool, 
        location, 
        organizer, 
        format, 
        req.params.id
      ];
      
      db.run(updateQuery, params, function(err) {
        if (err) {
          console.error('Database error:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ 
            message: 'Ошибка при обновлении турнира',
            error: err.message 
          });
        }

        if (this.changes === 0) {
          db.run('ROLLBACK');
          return res.status(404).json({ message: 'Турнир не найден' });
        }

        // Удаляем старые связи с командами
        db.run('DELETE FROM tournament_teams WHERE tournament_id = ?', [req.params.id], function(err) {
          if (err) {
            console.error('Error deleting old team associations:', err);
            db.run('ROLLBACK');
            return res.status(500).json({ 
              message: 'Ошибка при обновлении команд турнира',
              error: err.message 
            });
          }

          // Добавляем новые связи с командами
          if (teams && teams.length > 0) {
            const insertTeamQuery = 'INSERT INTO tournament_teams (tournament_id, team_id) VALUES (?, ?)';
            let completed = 0;
            let hasError = false;

            teams.forEach(teamId => {
              db.run(insertTeamQuery, [req.params.id, teamId], function(err) {
                if (err) {
                  console.error('Error inserting team association:', err);
                  hasError = true;
                }
                completed++;

                if (completed === teams.length) {
                  if (hasError) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ 
                      message: 'Ошибка при обновлении команд турнира',
                      error: 'Не удалось добавить все команды'
                    });
                  }
                  db.run('COMMIT');
                  res.json({ 
                    message: 'Турнир успешно обновлен',
                    id: req.params.id
                  });
                }
              });
            });
          } else {
            db.run('COMMIT');
            res.json({ 
              message: 'Турнир успешно обновлен',
              id: req.params.id
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Server error in PUT /tournaments/:id:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при обновлении турнира',
      error: error.message 
    });
  }
});

// Удаление турнира
router.delete('/:id', auth, async (req, res) => {
  try {
        console.log('DELETE /api/tournaments/:id - ID:', req.params.id);
        
        db.run('DELETE FROM tournaments WHERE id = ?', [req.params.id], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    message: 'Ошибка при удалении турнира',
                    error: err.message 
                });
    }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Турнир не найден' });
            }
            console.log('Tournament deleted, changes:', this.changes);
            res.json({ message: 'Турнир успешно удален' });
        });
  } catch (error) {
        console.error('Server error in DELETE /tournaments/:id:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера при удалении турнира',
            error: error.message 
        });
  }
});

module.exports = router; 