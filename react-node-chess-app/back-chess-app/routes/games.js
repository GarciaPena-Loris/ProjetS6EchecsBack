var express = require('express');

var router = express.Router();
var Game = require('../models/exercisesModel');

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.getAllGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single Game by Name
router.get('/:name', async (req, res) => {
  try {
    const games = await Game.getGameById(req.params.id);
    res.json(games);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Update an existing Game
router.put('/:id', async (req, res) => {
  try {
    const name = req.params.name;
    const games = req.body;
    const updatedGame = await Game.updateGame(id, games);
    res.json(updatedGame);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Game
router.delete('/:id', async (req, res) => {
  try {
    const name = req.params.name;
    const removedGame = await Game.deleteGame(name);
    res.json(removedGame);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
