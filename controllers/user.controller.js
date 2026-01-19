const mongoose = require('mongoose');
const userService = require('../services/user.service');

const createUser = async (req, res) => {
  const { name, email, password, age } = req.body;

  if (!name || !email || !password || !age) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await userService.createUser({ name, email, password, age });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const user = result.data;
    return res.status(201).json({
      data: { name: user.name, email: user.email, age: user.age },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.json({
      data: result.data,
      pagenation: result.pagination,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await userService.getUserById(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.json({ data: result.data });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await userService.updateUser(id, req.body);

    if (result.error) {
      if (result.error === 'User not found') {
        return res.status(404).json({ message: result.error });
      }
      return res.status(400).json({ message: result.error });
    }

    return res.json({ data: result.data });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await userService.deleteUser(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res
      .status(202)
      .json({ message: 'User deleted successfully', data: result.data });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

