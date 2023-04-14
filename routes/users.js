const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers } = require('../controllers/users');
const { getUserById } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');
const validateURL = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL).required(),
  }),
}), updateAvatar);

module.exports = router; // экспортировали роутер
