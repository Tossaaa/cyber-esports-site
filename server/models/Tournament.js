const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  teams: {
    type: Number,
    required: true,
    min: 2,
    max: 32
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Предстоящий', 'Идет', 'Завершен'],
    default: 'Предстоящий'
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновление updatedAt перед каждым сохранением
tournamentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tournament', tournamentSchema); 