const router = require('express').Router();

const {
  getAllMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { movieIdValidation, createMovieValidation } = require('../middlewares/validation');

router.get('/', getAllMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
