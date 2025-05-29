const db = require('../database/db');

// Получить игрока месяца для конкретной игры
exports.getPlayerOfMonth = async (req, res) => {
  try {
    const { game } = req.params;
    console.log('Getting player of month for game:', game);
    
    db.get(
      'SELECT * FROM player_of_month WHERE game = ? ORDER BY created_at DESC LIMIT 1',
      [game],
      (err, player) => {
        if (err) {
          console.error('Error in getPlayerOfMonth:', err);
          return res.status(500).json({ message: 'Ошибка при получении данных игрока месяца' });
        }

        if (!player) {
          return res.status(404).json({ message: 'Игрок месяца не найден' });
        }

        console.log('Found player:', player);
        res.json(player);
      }
    );
  } catch (error) {
    console.error('Error in getPlayerOfMonth:', error);
    res.status(500).json({ message: 'Ошибка при получении данных игрока месяца' });
  }
};

// Создать нового игрока месяца
exports.createPlayerOfMonth = async (req, res) => {
  try {
    const { name, team, role, image, kills, headshots, rating, mvp, game } = req.body;
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO player_of_month (
        name, team, role, image, kills, headshots, rating, mvp, game, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, team, role, image, kills, headshots, rating, mvp, game, now, now],
      function(err) {
        if (err) {
          console.error('Error in createPlayerOfMonth:', err);
          return res.status(500).json({ message: 'Ошибка при создании игрока месяца' });
        }

        // Получаем созданного игрока
        db.get(
          'SELECT * FROM player_of_month WHERE id = ?',
          [this.lastID],
          (err, player) => {
            if (err) {
              console.error('Error fetching created player:', err);
              return res.status(500).json({ message: 'Ошибка при получении данных созданного игрока' });
            }

            res.status(201).json(player);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error in createPlayerOfMonth:', error);
    res.status(500).json({ message: 'Ошибка при создании игрока месяца' });
  }
};

// Обновить игрока месяца
exports.updatePlayerOfMonth = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, team, role, image, kills, headshots, rating, mvp, game } = req.body;
    const now = new Date().toISOString();

    db.run(
      `UPDATE player_of_month SET 
        name = ?, team = ?, role = ?, image = ?, 
        kills = ?, headshots = ?, rating = ?, mvp = ?, 
        game = ?, updated_at = ?
      WHERE id = ?`,
      [name, team, role, image, kills, headshots, rating, mvp, game, now, id],
      function(err) {
        if (err) {
          console.error('Error in updatePlayerOfMonth:', err);
          return res.status(500).json({ message: 'Ошибка при обновлении игрока месяца' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: 'Игрок месяца не найден' });
        }

        // Получаем обновленного игрока
        db.get(
          'SELECT * FROM player_of_month WHERE id = ?',
          [id],
          (err, player) => {
            if (err) {
              console.error('Error fetching updated player:', err);
              return res.status(500).json({ message: 'Ошибка при получении данных обновленного игрока' });
            }

            res.json(player);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error in updatePlayerOfMonth:', error);
    res.status(500).json({ message: 'Ошибка при обновлении игрока месяца' });
  }
};

// Удалить игрока месяца
exports.deletePlayerOfMonth = async (req, res) => {
  try {
    const { id } = req.params;

    db.run(
      'DELETE FROM player_of_month WHERE id = ?',
      [id],
      function(err) {
        if (err) {
          console.error('Error in deletePlayerOfMonth:', err);
          return res.status(500).json({ message: 'Ошибка при удалении игрока месяца' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: 'Игрок месяца не найден' });
        }

        res.json({ message: 'Игрок месяца успешно удален' });
      }
    );
  } catch (error) {
    console.error('Error in deletePlayerOfMonth:', error);
    res.status(500).json({ message: 'Ошибка при удалении игрока месяца' });
  }
}; 