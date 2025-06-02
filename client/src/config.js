// Базовый URL для API
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cyber-esports-site.onrender.com/api'  // URL для продакшена
  : 'http://localhost:5001/api';  // URL для разработки 