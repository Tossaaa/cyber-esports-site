const db = require('../database/db');

// Получить все команды для конкретной игры
exports.getTeams = async (req, res) => {
  try {
    const { game } = req.params;
    console.log('Getting teams for game:', game);
    
    db.all(
      'SELECT * FROM teams WHERE game = ? ORDER BY points DESC',
      [game],
      (err, teams) => {
        if (err) {
          console.error('Error in getTeams:', err);
          return res.status(500).json({ message: 'Ошибка при получении списка команд' });
        }

        console.log('Found teams:', teams);
        res.json(teams);
      }
    );
  } catch (error) {
    console.error('Error in getTeams:', error);
    res.status(500).json({ message: 'Ошибка при получении списка команд' });
  }
};

// Создать новую команду
exports.createTeam = async (req, res) => {
  try {
    const { name, logo, points, game, country, founded, description } = req.body;
    console.log('Creating team with data:', { name, logo, points, game, country, founded, description });

    // Проверяем, что points не превышает 1000
    if (points && (points < 0 || points > 1000)) {
      console.log('Invalid points value:', points);
      return res.status(400).json({ message: 'Количество баллов должно быть от 0 до 1000' });
    }

    // Проверяем, не занято ли название команды
    db.get('SELECT id FROM teams WHERE name = ?', [name], (err, row) => {
      if (err) {
        console.error('Error checking team name:', err);
        return res.status(500).json({ message: 'Ошибка при проверке названия команды' });
      }

      if (row) {
        console.log('Team name already exists:', name);
        return res.status(400).json({ message: 'Команда с таким названием уже существует' });
      }

      console.log('Team name is unique, proceeding with creation');
      const now = new Date().toISOString();
      db.run(
        `INSERT INTO teams (
          name, logo, points, game, country, founded, description, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, logo, points, game, country, founded, description, now, now],
        function(err) {
          if (err) {
            console.error('Error in createTeam database insert:', err);
            return res.status(500).json({ message: 'Ошибка при создании команды' });
          }

          console.log('Team created with ID:', this.lastID);

          // Получаем созданную команду
          db.get(
            'SELECT * FROM teams WHERE id = ?',
            [this.lastID],
            (err, team) => {
              if (err) {
                console.error('Error fetching created team:', err);
                return res.status(500).json({ message: 'Ошибка при получении данных созданной команды' });
              }

              console.log('Retrieved created team:', team);

              // Если есть логотип и он не является полным URL, добавляем базовый URL
              if (team.logo && !team.logo.startsWith('http')) {
                team.logo = `http://localhost:5001${team.logo}`;
              }

              res.status(201).json(team);
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Unexpected error in createTeam:', error);
    res.status(500).json({ message: 'Ошибка при создании команды' });
  }
};

// Обновить команду
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, points, game, country, founded, description } = req.body;

    // Проверяем, что points не превышает 1000
    if (points && (points < 0 || points > 1000)) {
      return res.status(400).json({ message: 'Количество баллов должно быть от 0 до 1000' });
    }

    // Проверяем, не занято ли название команды другой командой
    db.get('SELECT id FROM teams WHERE name = ? AND id != ?', [name, id], (err, row) => {
      if (err) {
        console.error('Error checking team name:', err);
        return res.status(500).json({ message: 'Ошибка при проверке названия команды' });
      }

      if (row) {
        return res.status(400).json({ message: 'Команда с таким названием уже существует' });
      }

      const now = new Date().toISOString();
      db.run(
        `UPDATE teams SET 
          name = ?, logo = ?, points = ?, game = ?, 
          country = ?, founded = ?, description = ?, 
          updated_at = ?
        WHERE id = ?`,
        [name, logo, points, game, country, founded, description, now, id],
        function(err) {
          if (err) {
            console.error('Error in updateTeam:', err);
            return res.status(500).json({ message: 'Ошибка при обновлении команды' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ message: 'Команда не найдена' });
          }

          // Получаем обновленную команду
          db.get(
            'SELECT * FROM teams WHERE id = ?',
            [id],
            (err, team) => {
              if (err) {
                console.error('Error fetching updated team:', err);
                return res.status(500).json({ message: 'Ошибка при получении данных обновленной команды' });
              }

              // Если есть логотип и он не является полным URL, добавляем базовый URL
              if (team.logo && !team.logo.startsWith('http')) {
                team.logo = `http://localhost:5001${team.logo}`;
              }

              res.json(team);
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Error in updateTeam:', error);
    res.status(500).json({ message: 'Ошибка при обновлении команды' });
  }
};

// Удалить команду
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    db.run(
      'DELETE FROM teams WHERE id = ?',
      [id],
      function(err) {
        if (err) {
          console.error('Error in deleteTeam:', err);
          return res.status(500).json({ message: 'Ошибка при удалении команды' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: 'Команда не найдена' });
        }

        res.json({ message: 'Команда успешно удалена' });
      }
    );
  } catch (error) {
    console.error('Error in deleteTeam:', error);
    res.status(500).json({ message: 'Ошибка при удалении команды' });
  }
}; 