const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies } = require('../controllers/movies');
const { createMovies } = require('../controllers/movies');
const { deleteMovies } = require('../controllers/movies');
const validateURL = require('../middlewares/validation');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
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
}), createMovies);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovies);

module.exports = router;