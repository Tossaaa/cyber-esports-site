const express = require('express');
const router = express.Router();
const playerOfMonthController = require('../controllers/playerOfMonthController');
const auth = require('../middleware/auth');
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/players');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Только изображения!'));
  }
});

// Получить игрока месяца для конкретной игры
router.get('/:game', (req, res) => {
  const { game } = req.params;
  
  console.log('Fetching player of month for game:', game);
  
  db.get('SELECT * FROM player_of_month WHERE game = ?', [game], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Ошибка при получении данных игрока' });
    }
    
    if (!row) {
      console.log('No player found for game:', game);
      return res.status(404).json({ message: 'Игрок месяца не найден' });
    }

    // Если есть изображение и оно не является полным URL, добавляем базовый URL
    if (row.image && !row.image.startsWith('http')) {
      row.image = `http://localhost:5001${row.image}`;
    }

    console.log('Found player:', row);
    res.json(row);
  });
});

// Создать нового игрока месяца (только для админов)
router.post('/', auth, playerOfMonthController.createPlayerOfMonth);

// Обновить игрока месяца (только для админов)
router.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, team, role, kills, headshots, rating, mvp, game } = req.body;
  const now = new Date().toISOString();

  // Если загружено новое изображение
  let imagePath = req.body.image; // Сохраняем текущий путь к изображению
  if (req.file) {
    imagePath = `/uploads/players/${req.file.filename}`;
  }

  db.run(`
    UPDATE player_of_month 
    SET name = ?, team = ?, role = ?, image = ?, kills = ?, headshots = ?, 
        rating = ?, mvp = ?, game = ?, updated_at = ?
    WHERE id = ?
  `, [name, team, role, imagePath, kills, headshots, rating, mvp, game, now, id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Ошибка при обновлении игрока' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Игрок не найден' });
    }

    // Получаем обновленные данные
    db.get('SELECT * FROM player_of_month WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Ошибка при получении обновленных данных' });
      }

      // Если есть изображение и оно не является полным URL, добавляем базовый URL
      if (row.image && !row.image.startsWith('http')) {
        row.image = `http://localhost:5001${row.image}`;
      }

      res.json(row);
    });
  });
});

// Удалить игрока месяца (только для админов)
router.delete('/:id', auth, playerOfMonthController.deletePlayerOfMonth);

module.exports = router; 