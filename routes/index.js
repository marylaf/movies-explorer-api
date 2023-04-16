const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/not-found-err');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),

  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use('/', auth, userRouter);
router.use('/', auth, movieRouter);

router.use(auth);
router.use((req, res, next) => {
  const error = new NotFound('Запрашиваемый ресурс не найден');
  return next(error);
});

module.exports = router;
