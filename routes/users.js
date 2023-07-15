const userRouter = require('express').Router();
const { validateUpdateProfile } = require('../middlewares/validation');
const { updateProfile } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');

userRouter.get('/', getCurrentUser);

userRouter.patch('/', validateUpdateProfile, updateProfile);

module.exports = userRouter; // экспортировали роутер
