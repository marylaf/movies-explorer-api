const { OK } = require('../utils/constants');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');

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

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
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
};

module.exports = {
  getCurrentUser,
  updateProfile,
};
