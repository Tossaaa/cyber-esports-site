const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const uploadRoutes = require('./routes/upload');
const playerOfMonthRoutes = require('./routes/playerOfMonth');
const teamRoutes = require('./routes/team');
const tournamentRoutes = require('./routes/tournament');
const { initDatabase } = require('./database/init');

const app = express();

// Настройки CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL вашего клиентского приложения
    credentials: true // Разрешаем передачу куки и заголовков авторизации
}));

// Middleware для парсинга JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Обслуживание статических файлов
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Настройка сессий
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.sqlite',
        dir: './src/database'
    }),
    secret: process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 часа
    }
}));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/player-of-month', playerOfMonthRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tournaments', tournamentRoutes);

// Initialize database
initDatabase();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        message: 'Что-то пошло не так!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 