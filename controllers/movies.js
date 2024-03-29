const Movie = require('../models/movie');
const { OK, CreateSmt } = require('../utils/constants');
const BadRequest = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');
const {
  badRequestMessage, forbiddenMessage, notFoundMessage,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(OK).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  console.log('РАБОТАЕТ', req.body);

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(CreateSmt).send({ data: movie });
    })
    .catch((err) => {
      // console.log('ERR', err, req.body);
      if (err.name === 'ValidationError') {
        const error = new BadRequest(badRequestMessage);
        return next(error);
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  const userId = req.user._id;

  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        const error = new NotFound(notFoundMessage);
        return next(error);
      }

      // Проверьте, является ли пользователь владельцем карточки
      if (movie.owner.toString() !== userId) {
        const error = new Forbidden(forbiddenMessage);
        return next(error);
      }
      return Movie.findByIdAndRemove(_id)
        .then((deletedMovie) => res.send({ data: deletedMovie }));
    }).catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest(badRequestMessage);
        return next(error);
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
