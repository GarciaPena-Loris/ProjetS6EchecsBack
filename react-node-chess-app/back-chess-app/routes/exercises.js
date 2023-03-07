var express = require('express');

var router = express.Router();
var Exercise = require('../models/exercisesModel');

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.getAllExercises();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single Exercise by id
router.get('/:id', async (req, res) => {
  try {
    const exercises = await Exercise.getExerciseById(req.params.id);
    res.json(exercises);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Update an existing Exercise
router.put('/:id', async (req, res) => {
  try {
    const name = req.params.name;
    const exercises = req.body;
    const updatedExercise = await Exercise.updateExercise(id, exercises);
    res.json(updatedExercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Exercise
router.delete('/:id', async (req, res) => {
  try {
    const name = req.params.name;
    const removedExercise = await Exercise.deleteExercise(name);
    res.json(removedExercise);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
