const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const UserErrors = require('../Errors/UserErrors');

const Register = async (req, res, next) => {
  const { name, email, password, age } = req.body;

  try {
    const user = await userService.createUser({ name, email, password, age });
    await emailService.sendWelcomeEmail(user);
    return res.status(201).json({
      data: user
    });
  } catch (err) {
    next(err);
  }
};


const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw UserErrors.UserNotFound;
    }
    const otp = userService.generateOTP();
    await userService.saveOTP(user._id, otp);
    await emailService.sendPasswordResetOTP(user, otp);
    return res.status(200).json({
      message: 'OTP sent to your email successfully'
    });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    await userService.verifyOTP(email, otp);
    return res.status(200).json({
      message: 'OTP verified successfully. You can now reset your password.'
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const user = await userService.resetPassword(email, newPassword);
    await emailService.sendPasswordResetConfirmation(user);
    return res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch (err) {
    next(err);
  }
};


const changePassword = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    const user = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    try {
      await emailService.sendPasswordResetConfirmation(user);
    } catch (emailError) {
      throw UserErrors.EmailSendFailed;
    }

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await userService.loginUser({ email, password });

    return res.json({ token: result.token, user: result.user });
  } catch (err) {
    next(err);
  }
};


const getAllUsers = async (req, res, next) => {
  try {
    console.log(req.query, typeof req.query.page, typeof req.query.limit);
    const result = await userService.getUsers(req.query);

    return res.json({
      data: result.data,
      pagenation: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);
    return res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  const id = req.user.userId;
  try {
    const user = await userService.getUserById(id);
    return res.json({ data: user });
  } catch (err) {
    next(err);
  }
};


const updateUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedUser = await userService.updateUser(id, req.body);
    return res.json({ data: updatedUser });
  } catch (err) {
    next(err);
  }
};

const updateMyProfile = async (req, res, next) => {
  const { userId } = req.user;
  const id = userId;
  try {
    const updatedUser = await userService.updateUser(id, req.body);
    return res.json({ data: updatedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedUser = await userService.deleteUser(id);
    return res
      .status(202)
      .json({ message: 'User deleted successfully', data: deletedUser });
  } catch (err) {
    next(err);
  }
};

const deleteMyProfile = async (req, res, next) => {
  const { userId } = req.user;
  const id = userId;
  try {
    const deletedUser = await userService.deleteUser(id);
    return res.json({ message: 'your account deleted successfully', data: deletedUser });
  } catch (err) {
    next(err);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const result = await userService.searchUsers(req.query);
    return res.json({
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  Register,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
  Login,
  getAllUsers,
  getUserById,
  getMyProfile,
  updateUser,
  updateMyProfile,
  deleteUser,
  deleteMyProfile,
  searchUsers,
};

