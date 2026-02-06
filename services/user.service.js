const User = require('../models/user.model');
const UserErrors = require('../Errors/UserErrors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const util = require('util');

const jwtsign = util.promisify(jwt.sign);
const jwtverify = util.promisify(jwt.verify);


// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP for secure storage
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Save OTP to user record
const saveOTP = async (userId, otp) => {
  const hashedOTP = hashOTP(otp);
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  const user = await User.findByIdAndUpdate(
    userId,
    {
      passwordResetOTP: hashedOTP,
      passwordResetExpires: expires,
      otpVerified: false
    },
    { new: true }
  );

  if (!user) {
    throw UserErrors.UserNotFound;
  }

  return user;
};

// Verify OTP and mark as verified
const verifyOTP = async (email, otp) => {
  if (!otp || otp.length !== 6) {
    throw UserErrors.InvalidOTP;
  }

  const hashedOTP = hashOTP(otp);

  const user = await User.findOne({
    email: email.toLowerCase(),
    passwordResetOTP: hashedOTP
  });

  if (!user) {
    throw UserErrors.InvalidOTP;
  }

  if (user.isOTPExpired()) {
    await clearOTP(user._id);
    throw UserErrors.ExpiredOTP;
  }

  // Mark OTP as verified
  user.otpVerified = true;
  await user.save();

  return user;
};

// Clear OTP fields
const clearOTP = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, {
    passwordResetOTP: null,
    passwordResetExpires: null,
    otpVerified: false
  });
  if (!user) {
    throw UserErrors.UserNotFound;
  }
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw UserErrors.UserNotFound;
  }
  return user;
};


// Reset password after OTP is verified
const resetPassword = async (email, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw UserErrors.InvalidPasswordFormat;
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw UserErrors.UserNotFound;
  }

  // Check if OTP was verified
  if (!user.otpVerified) {
    throw UserErrors.OTPNotVerified;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  if (!hashedPassword) {
    throw UserErrors.InvalidUserData;
  }
  user.password = hashedPassword;
  user.passwordResetOTP = null;
  user.passwordResetExpires = null;
  user.otpVerified = false;

  await user.save();

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw UserErrors.InvalidPasswordFormat;
  }

  const user = await User.findById(userId);

  if (!user) {
    throw UserErrors.UserNotFound;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw UserErrors.IncorrectPassword;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  if (!hashedPassword) {
    throw UserErrors.InvalidUserData;
  }
  user.password = hashedPassword;
  await user.save();

  return user;
};



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

  const usersPromise = User.find({ role: { $ne: 'admin' } }, { password: 0 })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalPromise = User.countDocuments({ role: { $ne: 'admin' } });

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
  const user = await User.findOne({ _id: id, role: { $ne: 'admin' } }, { password: 0, __v: 0 });
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
  const existingUser = await User.findOne({ email, _id: { $ne: id }, role: { $ne: 'admin' } });
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

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    age: updatedUser.age,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
};

const deleteUser = async (id) => {
  const deletedUser = await User.findOneAndDelete({ _id: id, role: { $ne: 'admin' } });
  if (!deletedUser) {
    throw UserErrors.UserNotFound;
  }
  return {
    id: deletedUser._id,
    name: deletedUser.name,
    email: deletedUser.email,
    age: deletedUser.age,
    role: deletedUser.role,
    createdAt: deletedUser.createdAt,
    updatedAt: deletedUser.updatedAt,
  };
};

const searchUsers = async ({ q, page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);

  // Build query to search by name or email (case-insensitive)
  const searchRegex = new RegExp(q, 'i');
  const query = {
    role: { $ne: 'admin' },
    $or: [
      { name: searchRegex },
      { email: searchRegex }
    ]
  };

  const usersPromise = User.find(query, { password: 0 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPromise = User.countDocuments(query);
  const [users, total] = await Promise.all([usersPromise, totalPromise]);

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

module.exports = {
  generateOTP,
  saveOTP,
  verifyOTP,
  clearOTP,
  getUserByEmail,
  resetPassword,
  changePassword,
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
};

