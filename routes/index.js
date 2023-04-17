const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/not-found-err');
const notFoundMessage = require('../utils/constants');

router.post('/signup', validateCreateUser, createUser);

router.post('/signin', validateLogin, login);

router.use('/', auth, userRouter);
router.use('/', auth, movieRouter);

router.use(auth);
router.use((req, res, next) => {
  const error = new NotFound(notFoundMessage);
  return next(error);
});

module.exports = router;
