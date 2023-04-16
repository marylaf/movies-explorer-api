const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies } = require('../controllers/movies');
const { createMovie } = require('../controllers/movies');
const { deleteMovie } = require('../controllers/movies');
const validateURL = require('../middlewares/validation');

movieRouter.get('/movies', getMovies);

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    image: Joi.string().custom(validateURL).required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    trailerLink: Joi.string().custom(validateURL).required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRouter.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = movieRouter;
