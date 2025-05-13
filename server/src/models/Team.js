const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  game: {
    type: String,
    required: true,
    enum: ['CS2', 'Dota 2', 'Valorant', 'PUBG']
  },
  logo: {
    type: String,
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
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
    youtube: String
  },
  country: {
    type: String,
    required: true
  },
  founded: {
    type: Date
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', teamSchema); 