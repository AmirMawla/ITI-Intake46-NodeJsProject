const validate = require('../middlewares/validate');
const schema = require('../schemas')
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { Authentication } = require('../middlewares/Authentication');
const restrictTo = require('../middlewares/restrictTo');


router.post('/Sign-Up', validate(schema.Users.createUserSchema) ,userController.Register);
router.post('/Login', validate(schema.Users.logInSchema) ,userController.Login);
router.get('/', Authentication, restrictTo(['admin']), validate(schema.Users.GetAllUsersSchema) ,userController.getAllUsers);
router.get('/:id', Authentication, restrictTo(['admin']), userController.getUserById);
router.patch('/:id', Authentication, restrictTo(['admin']), validate(schema.Users.UpdateUserSchema) ,userController.updateUser);
router.delete('/:id', Authentication, restrictTo(['admin']), userController.deleteUser);

module.exports = router;

