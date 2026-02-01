const userService = require('../services/user.service');


const Register = async (req, res, next) => {
  const { name, email, password, age } = req.body;

  try {
    const user = await userService.createUser({ name, email, password, age });
    return res.status(201).json({
      data:user
    });
  } catch (err) {
     next(err);
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

const updateUser = async (req, res, next) => {
  const { id } = req.params;

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

module.exports = {
  Register, 
  Login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

