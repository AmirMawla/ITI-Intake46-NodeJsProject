const User = require('../models/user.model');
const UserErrors = require('../Errors/UserErrors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

const jwtsign = util.promisify(jwt.sign);
const jwtverify = util.promisify(jwt.verify);


const createUser = async ({ name, email, password, age }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw UserErrors.EmailAlreadyExists;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    throw UserErrors.InvalidUserData;
  }

  const user = await User.create({ name, email, password: hashedPassword, age });
  if (!user) {
    throw UserErrors.InvalidUserData;
  }
   
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    role: user.role,
  };
};


const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw UserErrors.UserNotFound;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw UserErrors.InvalidCredentials;
  }
  const payload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    role: user.role,
  };
  const token = await jwtsign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
    }
  };
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
    throw UserErrors.UserNotFound;
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
    throw UserErrors.UserNotFound;
  }
  return user;
};

const updateUser = async (id, { name, email, age }) => {
  const olduser = await getUserById(id);
  if (!olduser) {
    throw UserErrors.UserNotFound;
  }
  const existingUser = await User.findOne({ email, _id: { $ne: id } });
  if (existingUser) {
    throw UserErrors.EmailAlreadyExists;
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { name, email, age },
    { new: true }
  );

  if (!updatedUser) {
    throw UserErrors.InvalidUserData;
  }

  return updatedUser;
};

const deleteUser = async (id) => {
  const deletedUser = await User.findOneAndDelete({ _id: id });
  if (!deletedUser) {
    throw UserErrors.UserNotFound;
  }
  return deletedUser;
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

