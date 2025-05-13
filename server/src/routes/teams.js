const router = require('express').Router();
const Team = require('../models/Team');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const { game } = req.query;
    const query = {};

    if (game) query.game = game;

    const teams = await Team.find(query)
      .populate('players')
      .populate('coach')
      .sort({ name: 1 });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
});

// Get single team
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('players')
      .populate('coach');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team', error: error.message });
  }
});

// Create team (admin only)
router.post('/', async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error: error.message });
  }
});

// Update team (admin only)
router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team', error: error.message });
  }
});

// Delete team (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error: error.message });
  }
});

// Add player to team (admin only)
router.post('/:id/players', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.players.push(req.body.playerId);
    await team.save();

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error adding player to team', error: error.message });
  }
});

// Remove player from team (admin only)
router.delete('/:id/players/:playerId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.players = team.players.filter(
      player => player.toString() !== req.params.playerId
    );

    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error removing player from team', error: error.message });
  }
});

module.exports = router; 