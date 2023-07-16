const express = require('express');
const cors = require('cors');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/not-found-err');
const { notFoundMessage } = require('../utils/constants');

const app = express();

app.post('/signup', validateCreateUser, createUser);

app.post('/signin', validateLogin, login);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/users/me', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.use(auth);
app.use((req, res, next) => {
  const error = new NotFound(notFoundMessage);
  return next(error);
});

module.exports = app;
