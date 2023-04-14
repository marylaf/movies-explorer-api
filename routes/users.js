const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { updateProfile } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = router; // экспортировали роутер
