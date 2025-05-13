const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  realName: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true,
    enum: ['CS2', 'Dota 2', 'Valorant', 'PUBG']
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  role: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  photo: {
    type: String
  },
  achievements: [{
    tournament: String,
    placement: Number,
    year: Number
  }],
  socialMedia: {
    twitter: String,
    instagram: String,
    facebook: String,
    twitch: String
  },
  statistics: {
    type: mongoose.Schema.Types.Mixed
  },
  biography: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema); 