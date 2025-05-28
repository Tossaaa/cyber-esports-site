const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, isAdmin } = require('../middleware/auth');
const Tournament = require('../models/Tournament');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/tournaments');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Неподдерживаемый формат файла. Разрешены только JPEG, PNG и GIF.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Получить все турниры
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ startDate: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении турниров' });
  }
});

// Получить турнир по ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Турнир не найден' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении турнира' });
  }
});

// Создать новый турнир (только для админов)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const {
      name,
      date,
      prize,
      teams,
      location,
      organizer,
      status,
      description
    } = req.body;

    const tournament = new Tournament({
      name,
      date,
      prize,
      teams: parseInt(teams),
      location,
      organizer,
      status,
      description,
      logo: req.file ? `/uploads/tournaments/${req.file.filename}` : null
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании турнира', error: error.message });
  }
});

// Обновить турнир (только для админов)
router.put('/:id', auth, isAdmin, upload.single('logo'), async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Турнир не найден' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.logo = `/uploads/tournaments/${req.file.filename}`;
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedTournament);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении турнира', error: error.message });
  }
});

// Удалить турнир (только для админов)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Турнир не найден' });
    }
    res.json({ message: 'Турнир успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении турнира', error: error.message });
  }
});

module.exports = router; 