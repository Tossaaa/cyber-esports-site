const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const auth = require('../middleware/auth');

// Middleware для проверки прав администратора
const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }
    next();
};

// Получение всех новостей
router.get('/', async (req, res) => {
    try {
        const news = await newsService.getAllNews();
        res.json(news);
    } catch (error) {
        console.error('Error getting news:', error);
        res.status(500).json({ message: 'Ошибка при получении новостей' });
    }
});

// Получение новости по ID
router.get('/:id', async (req, res) => {
    try {
        const news = await newsService.getNewsById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'Новость не найдена' });
        }
        res.json(news);
    } catch (error) {
        console.error('Error getting news by id:', error);
        res.status(500).json({ message: 'Ошибка при получении новости' });
    }
});

// Получение новостей по тегу
router.get('/tag/:tag', async (req, res) => {
    try {
        const news = await newsService.getNewsByTag(req.params.tag);
        res.json(news);
    } catch (error) {
        console.error('Error getting news by tag:', error);
        res.status(500).json({ message: 'Ошибка при получении новостей' });
    }
});

// Создание новой новости (только для админов)
router.post('/', auth, checkAdmin, async (req, res) => {
    try {
        const { title, description, content, image_url, game_tag } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Заголовок и описание обязательны' });
        }
        const news = await newsService.createNews({
            title,
            description,
            content,
            image_url,
            game_tag,
            author_id: req.user.id
        });
        res.status(201).json(news);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ message: 'Ошибка при создании новости' });
    }
});

// Обновление новости (только для админов)
router.put('/:id', auth, checkAdmin, async (req, res) => {
    try {
        const { title, description, content, image_url, game_tag } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Заголовок и описание обязательны' });
        }
        const news = await newsService.updateNews(req.params.id, {
            title,
            description,
            content,
            image_url,
            game_tag
        });
        res.json(news);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ message: 'Ошибка при обновлении новости' });
    }
});

// Удаление новости (только для админов)
router.delete('/:id', auth, checkAdmin, async (req, res) => {
    try {
        await newsService.deleteNews(req.params.id);
        res.json({ message: 'Новость успешно удалена' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ message: 'Ошибка при удалении новости' });
    }
});

module.exports = router; 