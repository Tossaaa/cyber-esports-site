const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаем директории для загрузки, если они не существуют
const uploadDirs = [
  path.join(__dirname, '../../public/uploads/teams'),
  path.join(__dirname, '../../public/uploads/players')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Определяем директорию в зависимости от типа загрузки
    const uploadDir = file.fieldname === 'logo' 
      ? path.join(__dirname, '../../public/uploads/teams')
      : path.join(__dirname, '../../public/uploads/players');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  // Разрешаем только изображения
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения!'), false);
  }
};

// Создаем middleware для загрузки
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Ограничение размера файла до 5MB
  }
});

module.exports = upload; 