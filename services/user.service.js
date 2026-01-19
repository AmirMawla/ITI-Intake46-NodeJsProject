const User = require('../models/user.model');

const createUser = async ({ name, email, password, age }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { error: 'User already exists' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }
  if (age < 18 || age > 100) {
    return { error: 'Age must be between 18 and 100' };
  }
  if (name.length < 3 || name.length > 30) {
    return { error: 'Name must be between 3 and 30 characters long' };
  }

  const user = await User.create({ name, email, password, age });
  if (!user) {
    return { error: 'Failed to create user' };
  }

  return { data: user };
};

const getUsers = async ({ page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);

  const usersPromise = User.find({}, { password: 0 })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalPromise = User.countDocuments();

  const [users, total] = await Promise.all([usersPromise, totalPromise]);

  if (!users || users.length === 0) {
    return { error: 'No users found' };
  }

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findOne({ _id: id }, { password: 0 });
  if (!user) {
    return { error: 'User not found' };
  }
  return { data: user };
};

const updateUser = async (id, { name, email, age }) => {
  if (!name || !email || !age) {
    return { error: 'All fields are required' };
  }

  const existingUser = await User.findOne({ email, _id: { $ne: id } });
  if (existingUser) {
    return { error: 'Email already exists' };
  }

  if (age < 18 || age > 100) {
    return { error: 'Age must be between 18 and 100' };
  }
  if (name.length < 3 || name.length > 30) {
    return { error: 'Name must be between 3 and 30 characters long' };
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { name, email, age },
    { new: true }
  );

  if (!updatedUser) {
    return { error: 'User not found' };
  }

  return { data: updatedUser };
};

const deleteUser = async (id) => {
  const deletedUser = await User.findOneAndDelete({ _id: id });
  if (!deletedUser) {
    return { error: 'User not found' };
  }
  return { data: deletedUser };
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

