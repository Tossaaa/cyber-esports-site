const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isAuth } = require('../middleware/auth');

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаем нового пользователя
    const user = new User({
      email,
      password,
      username
    });

    await user.save();

    // Создаем токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Отправляем ответ без пароля
    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar
    };

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации', error: error.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Создаем токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Отправляем ответ без пароля
    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar
    };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при входе', error: error.message });
  }
});

// Получение информации о текущем пользователе
router.get('/me', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

module.exports = router; 