var express = require('express');

var router = express.Router();
var Level = require('../models/exercisesModel');

// Get all levels
router.get('/', async (req, res) => {
  try {
    const levels = await Level.getAllLevels();
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single Level by Name
router.get('/:name', async (req, res) => {
  try {
    const levels = await Level.getLevelById(req.params.id);
    res.json(levels);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Update an existing Level
router.put('/:id', async (req, res) => {
  try {
    const name = req.params.name;
    const levels = req.body;
    const updatedLevel = await Level.updateLevel(id, levels);
    res.json(updatedLevel);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Level
router.delete('/:id', async (req, res) => {
  try {
    const name = req.params.name;
    const removedLevel = await Level.deleteLevel(name);
    res.json(removedLevel);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
