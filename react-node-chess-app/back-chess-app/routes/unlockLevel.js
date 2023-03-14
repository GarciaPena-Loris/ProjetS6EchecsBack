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

    // Verification validity
    if ((nameParam == nameCode && nameCode == decoded.name) && (idParam == idCode)) { // Verif name and id
      const actuelEloExercise = await EloExercise.getEloFromEloExerciseBIdyName(idParam, nameParam);

      if ((actuelEloExercise == actualEloCode) && (pointsParam == pointsCode)) { // Verif points
        // get actuel exercise from level id
        const id_exercise_obj = await Levels.getExerciseByLevelId(idCode);

        // change elo exercise
        await EloExercise.updateEloExercise(id_exercise_obj.id_exercise, nameParam, pointsCode);

        if (pointsCode > 0) {
          // get level unlockable
          const unlockableLevels = await Levels.getUnlockableLevels(id_exercise_obj.id_exercise, actualEloCode + pointsCode);

          // Vérifier si l'utilisateur peut débloquer de nouveaux niveaux
          unlockableLevels.forEach(async level => {
            await UnlockLevel.addUnlockLevel(level.id, nameCode);
          });
        }

        // change elo user 
        await User.changeEloUser(nameCode, Math.ceil((Math.abs(pointsCode) * 5) / 100) * Math.sign(pointsCode));

        // get new elo
        const newEloUser = await User.getEloUserByName(nameCode);

        res.json({ newEloExercise: (actualEloCode + pointsCode), newEloUser: newEloUser.global_elo });
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
