const Movie = require('../models/movie');
const { OK, CreateSmt } = require('../utils/constants');
const BadRequest = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Movie.find(req.params)
    .then((movies) => res.status(OK).send({ data: movies }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(CreateSmt).send({ data: movie }))
    .catch((err) => {
      // console.log('ERR', err, req.body);
      if (err.name === 'ValidationError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        const error = new NotFound('Такого фильма не существует');
        return next(error);
      }

      // Проверьте, является ли пользователь владельцем карточки
      if (movie.owner.toString() !== userId) {
        const error = new Forbidden('У вас нет прав для удаления этого фильма');
        return next(error);
      }
      return Movie.findByIdAndRemove(movieId)
        .then((deletedMovie) => res.send({ data: deletedMovie }));
    }).catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createMovie,
  deleteMovie,
};
