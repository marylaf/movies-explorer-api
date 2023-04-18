const userRouter = require('express').Router();
const { validateUpdateProfile } = require('../middlewares/validation');
const { updateProfile } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');

userRouter.get('/users/me', getCurrentUser);

userRouter.patch('/users/me', validateUpdateProfile, updateProfile);

module.exports = userRouter; // экспортировали роутер
