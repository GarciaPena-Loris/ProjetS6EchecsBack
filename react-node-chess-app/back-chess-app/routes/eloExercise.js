var express = require('express');
const CryptoJS = require('crypto-js');

var router = express.Router();
var EloExercise = require('../models/eloExerciseModel');

// Get all progress
router.get('/', async (req, res) => {
  try {
    const exercises = await EloExercise.getAllEloExercise();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single EloExercise by Name
router.get('/:name/:id', async (req, res) => {
  try {
    const eloExercise = await EloExercise.getEloExerciseByNameId(req.params.id, req.params.name);
    res.json({ eloExercice: eloExercise });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get a single EloExercise by Name
router.get('/elo/:name/:id', async (req, res) => {
  try {
    const elo = await EloExercise.getEloFromEloExerciseBIdyName(req.params.id, req.params.name);
    res.json({ exerciceElo: elo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Update an existing EloExercise
router.put('/:name/:id', async (req, res) => {
  try {
    const updatedeloExercise = await EloExercise.updateEloExercise(req.params.id, req.params.name, req.body.elo);
    res.json(updatedeloExercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// change points to playeur in exercice Id
router.put('/change/:name/:id', async (req, res) => {
  try {
    const decoded = res.decoded;
    const nameParam = req.params.name;
    const idParam = req.params.id;
    const points = req.body.points;

    // recupere un code crypte du type name/id/pointsActuel/newPoints(- or +)
    const encrypted = req.body.encrypted;
    const message = CryptoJS.AES.decrypt(encrypted, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    const parts = message.split('/');
    const nameMessage = parts[0];
    const idMessage = parts[1];
    const actualPointsMessage = parseInt(parts[2]);
    const newPointsMessage = parseInt(parts[3]);

    // Verification validity
    if (decoded.role == "admin") {
      const updatedeloExercise = await EloExercise.changePointsExercise(req.params.id, req.params.name, points);
      res.json(updatedeloExercise);
    }
    else if (nameParam == nameMessage == decoded.name && idParam == idMessage) { // Verif name and id
      const pointseloExercise = await EloExercise.getPointseloExerciseByNameId(req.params.id, req.params.name);
      if ((pointseloExercise == actualPointsMessage) && (points == newPointsMessage)) { // Verif points
        // change points to progress
        const changePoints = await EloExercise.changePointsExercise(req.params.id, req.params.name, pointseloExercise + points);

        // change points to user elo
        const changeEloUser = await EloExercise.changePointsExercise(req.params.id, req.params.name, (newPointsMessage * 5) / 100);

        res.json({ changePoints, changeEloUser });
      }
      else {
        res.status(406).json({ error: "Points do not correspond" });
      }
    }
    else {
      res.status(405).json({ error: "Permission denied" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
