var express = require('express');
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
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = req.body;
    const createdUser = await User.createUser(user);
    res.json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing user
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.body;
    const updatedUser = await User.updateUser(id, user, {});
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const removedUser = await User.removeUser(req.params.id);
    res.json(removedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
