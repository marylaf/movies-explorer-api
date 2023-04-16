const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/not-found-err');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://mary.student.nomoredomains.monster',
    'http://mary.student.nomoredomains.monster',
    'https://api.mary.student.nomoredomains.monster',
    'http://api.mary.student.nomoredomains.monster',
  ],
  credentials: true,
}));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),

  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/', auth, userRouter);
app.use('/', auth, movieRouter);

app.use(auth);
app.use((req, res, next) => {
  const error = new NotFound('Запрашиваемый ресурс не найден');
  return next(error);
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Внутренняя ошибка сервера'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
