const express = require('express');
const cors = require('cors');
const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/not-found-err');
const { notFoundMessage } = require('../utils/constants');

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.status(200).end();
  }
  return next();
});

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
