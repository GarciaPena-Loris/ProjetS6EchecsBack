var express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //JWT sont utilisés pour la validation d'authentification sur les applications Web
const saltRounds = 10;

var router = express.Router();
var User = require('../models/userModel');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by Name
router.get('/:name', async (req, res) => {
  try {
    const user = await User.getUserByName(req.params.name);
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create a new user //gerer les nom de joueur trop long ou trop court ou deja utilisé.
router.post('/signup', (req, res) => {
  const user = req.body;

  // Check if all required fields are present
  if (!user.name || !user.password) {
    return res.status(400).json({ error: 'Name and password are required fields' });
  }

  // Hash the password
  bcrypt.hash(user.password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    user.password = hash;

    // Save the user to the database
    User.createUser(user).then(result => {
      res.json({ succes: "User created successfully" });
    }).catch(error => {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(401).json({ error: 'A user with this name already exists' });
      }
      return res.status(400).json({ error: error.message });
    });
  });
});

// User signin
router.post('/signin', (req, res) => {
  const { name, password } = req.body;

  // Check if all required fields are present
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required fields' });
  }

  // Query the database for a user with the provided name
  User.getUserByName(name).then(user => {
    // Check if a user with the provided name was found
    if (!user) {
      return res.status(402).json({ error: 'Name or password is incorrect' });
    }

    // Compare the provided password with the hashed password stored in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!result) {
        return res.status(402).json({ error: 'Name or password is incorrect' });
      }

      try {
        // If the name and password are correct, return a JWT to the client
        const token = jwt.sign({ name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log(token);
        res.json({ token });
      }
      catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }).catch(error => {
    return res.status(500).json({ error: error.message });
  });
});


// Update an existing user
router.put('/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const newName = req.body;
    const updatedUser = await User.updateNameUser(name, newName);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete('/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const removedUser = await User.deleteUser(name);
    res.json(removedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
