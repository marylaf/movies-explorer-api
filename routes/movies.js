const movieRouter = require('express').Router();
const { getMovies } = require('../controllers/movies');
const { createMovie } = require('../controllers/movies');
const { deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

movieRouter.get('/movies', getMovies);

movieRouter.post('/movies', validateCreateMovie, createMovie);

movieRouter.delete('/movies/:_id', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;
