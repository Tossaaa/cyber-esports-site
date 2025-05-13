const router = require('express').Router();
const Tournament = require('../models/Tournament');

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const { game, status } = req.query;
    const query = {};

    if (game) query.game = game;
    if (status) query.status = status;

    const tournaments = await Tournament.find(query)
      .populate('teams')
      .sort({ startDate: -1 });

    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tournaments', error: error.message });
  }
});

// Get single tournament
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('teams')
      .populate({
        path: 'teams',
        populate: {
          path: 'players',
          model: 'Player'
        }
      });

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tournament', error: error.message });
  }
});

// Create tournament (admin only)
router.post('/', async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tournament', error: error.message });
  }
});

// Update tournament (admin only)
router.put('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tournament', error: error.message });
  }
});

// Delete tournament (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tournament', error: error.message });
  }
});

module.exports = router; 