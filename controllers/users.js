const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OK } = require('../utils/constants');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { JWT_SECRET, NODE_ENV } = process.env;

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new NotFound('Такого пользователя не существует');
        return next(error);
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name, email, password: hash,
  }))
    // возвращаем записанные в базу данные пользователю
    .then((user) => res.status(OK).send({ data: user }))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      // console.log('ERR', err, req.body);
      if (err.code === 11000 || err.code === 11001) {
        const error = new ConflictError('Пользователь с таким email уже существует');
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      return res.status(OK).send({ data: user, token });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findOne({ email }, (queryError) => {
    if (queryError) {
      if (queryError.code === 11000 || queryError.code === 11001) {
        const error = new ConflictError('Пользователь с таким email уже существует');
        return next(error);
      }
      return next(queryError);
    }

    return User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
      },
    )
      .then((user) => {
        if (!user) {
          const error = new NotFound('Такого пользователя не существует');
          return next(error);
        }
        return res.status(OK).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          const error = new BadRequest('Некорректный запрос');
          return next(error);
        }
        return next(err);
      });
  });
};

module.exports = {
  getCurrentUser,
  updateProfile,
  login,
  createUser,
};
