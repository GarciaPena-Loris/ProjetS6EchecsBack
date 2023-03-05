var express = require('express');

var router = express.Router();
var Level = require('../models/levelsModel');

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
router.get('/:id', async (req, res) => {
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
    const id = req.params.id;
    const level = req.body;
    const updatedLevel = await Level.updateLevel(id, level);
    res.json(updatedLevel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Level
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const removedLevel = await Level.deleteLevel(id);
    res.json(removedLevel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all level From exercise Id
router.get('/allLevels/:id_exercise', async (req, res) => {
  try {
    const id_exercise = req.params.id_exercise;
    const levels = await Level.getLevelByExerciseId(id_exercise);
    res.json(levels);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
