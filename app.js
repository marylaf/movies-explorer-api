const dotenv = require('dotenv');

dotenv.config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { setError } = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGODB_URI } = require('./config');
// const limiter = require('./middlewares/limit');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateCreateUser, validateLogin } = require('./middlewares/validation');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const NotFound = require('./errors/not-found-err');
const { notFoundMessage } = require('./utils/constants');

const app = express();

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const myLogger = function (req, res, next) {
  next();
};

app.use(myLogger);

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
// app.use(limiter);
app.use(errorLogger);

app.post('/signup', validateCreateUser, createUser);

app.post('/signin', validateLogin, login);

app.use('/users/me', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.use(auth);
app.use((req, res, next) => {
  console.log('NOTF');
  const error = new NotFound(notFoundMessage);
  return next(error);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errors());
app.use(setError);

module.exports = app;
