var express = require('express');
const CryptoJS = require('crypto-js');

var router = express.Router();
var UnlockLevel = require('../models/unlockLevelModel');
var EloExercise = require('../models/eloExerciseModel');
var Levels = require('../models/levelsModel');
var User = require('../models/userModel');

// Get all progress
router.get('/', async (req, res) => {
  try {
    const progress = await UnlockLevel.getAllUnlockLevel();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all UnlockLevel by Name
router.get('/:name', async (req, res) => {
  try {
    const progress = await UnlockLevel.getAllUnlockLevelByName(req.params.name);
    res.json(progress);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Get a single UnlockLevel by Name
router.get('/:name/:id', async (req, res) => {
  try {
    const progress = await UnlockLevel.getUnlockLevelByNameId(req.params.name, req.params.id);
    res.json(progress);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Update an existing UnlockLevel
router.put('/:name/:id', async (req, res) => {
  try {
    const progress = req.body;
    const name = req.params.name;
    const id = req.params.id;
    const updatedUnlockLevel = await UnlockLevel.updateUnlockLevel(req.params.name, req.params.id, progress);
    res.json(updatedUnlockLevel);
    res.status(405).json({ error: "Permission denied" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// change points to playeur in Game Id
router.put('/save/:name/:id', async (req, res) => {
  try {
    const decoded = req.decoded;
    const nameParam = req.params.name;
    const idParam = req.params.id;
    const pointsParam = req.body.points;
    // recupere un code crypte du type id_level/name/eloActuel/newelo(- or +)
    const encrypted = req.body.encrypted;
    const message = CryptoJS.AES.decrypt(encrypted, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
    const parts = message.split('/');

    const idCode = parts[0];
    const nameCode = parts[1];
    const actualEloCode = parseInt(parts[2]);
    const pointsCode = parseInt(parts[3]);

    let newEloExercise = 0;
    let newEloUser = 0;
    // Verification validity
    if ((nameParam == nameCode && nameCode == decoded.name) && (idParam == idCode)) { // Verif name and id
      const actuelEloExercise = await EloExercise.getEloFromEloExerciseBIdyName(idCode, nameParam);

      if ((actuelEloExercise == actualEloCode) && (pointsParam == pointsCode)) { // Verif points
        // changer elo exercise
        if (actualEloCode + pointsCode <= 0) {
          // change elo exercise to 0
          await EloExercise.updateTo0EloExercise(idCode, nameParam);
          newEloExercise = 0;
        }
        else {
          // change elo exercise
          await EloExercise.updateEloExercise(idCode, nameParam, pointsCode);
          newEloExercise = actualEloCode + pointsCode;

          //check if user can unlock new levels
          if (pointsCode > 0) {
            // get level unlockable
            const unlockableLevels = await Levels.getUnlockableLevels(idCode, actualEloCode + pointsCode);

            // Vérifier si l'utilisateur peut débloquer de nouveaux niveaux
            unlockableLevels.forEach(async level => {
              await UnlockLevel.addUnlockLevel(level.id, nameCode);
            });
          }
        }

        // changer elo user
        // get actual elo
        const eloUser = await User.getEloUserByName(nameCode);

        const newPointsElo = Math.ceil((Math.abs(pointsCode) * 5) / 100) * Math.sign(pointsCode);
        if (eloUser === 0) {
          res.json({ newEloExercise: newEloExercise, newEloUser: 0 });
        }
        else if (eloUser.global_elo + newPointsElo <= 0) {
          // change elo user to 0 
          await User.changeTo0EloUser(nameCode);
          res.json({ newEloExercise: newEloExercise, newEloUser: 0 });
        }
        else {
          // change elo user 
          await User.changeEloUser(nameCode, newPointsElo);
          newEloUser = eloUser.global_elo + newPointsElo;
          res.json({ newEloExercise: newEloExercise, newEloUser: newEloUser });
        }
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
