var express = require('express');
const CryptoJS = require('crypto-js');

var router = express.Router();
var ProgressGame = require('../models/progressGameModel');
var User = require('../models/userModel');
const e = require('express');

// Get all progress
router.get('/', async (req, res) => {
  try {
    const progress = await ProgressGame.getAllProgressGame();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single ProgressGame by Name
router.get('/:name/:id', async (req, res) => {
  try {
    const progress = await ProgressGame.getProgressGameByNameId(req.params.name, req.params.id);
    res.json(progress);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Update an existing ProgressGame
router.put('/:name/:id', async (req, res) => {
  try {
    const progress = req.body;
    const name = req.params.name;
    const id = req.params.id;
    const updatedProgressGame = await ProgressGame.updateProgressGame(req.params.name, req.params.id, progress);
    res.json(updatedProgressGame);
    res.status(405).json({ error: "Permission denied" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// change points to playeur in game Id
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
      const updatedProgressGame = await ProgressGame.changePointsGame(req.params.id, req.params.name, points);
      res.json(updatedProgressGame);
    }
    else if (nameParam == nameMessage == decoded.name && idParam == idMessage) { // Verif name and id
      const pointsProgressGame = await ProgressGame.getPointsProgressGameByNameId(req.params.id, req.params.name);
      if ((pointsProgressGame == actualPointsMessage) && (points == newPointsMessage)) { // Verif points
        // change points to progress
        const changePoints = await ProgressGame.changePointsGame(req.params.id, req.params.name, pointsProgressGame + points);

        // change points to user elo
        const changeEloUser = await ProgressGame.changePointsGame(req.params.id, req.params.name, (newPointsMessage * 5) / 100);

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
