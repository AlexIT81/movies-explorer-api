const Movie = require('../models/movie');

const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../errors');

const { CREATED_OK_CODE } = require('../utils/constants');

module.exports.getAllMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
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
  } = req.body;
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
    .then((movie) => res.status(CREATED_OK_CODE).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (movie.owner.toString() === userId) {
        Movie.deleteOne({ _id: movieId })
          .then((deleteMovie) => {
            if (deleteMovie === null) {
              throw new NotFoundError(`Фильм с указанным _id: ${movieId} не найден.`);
            } else { res.send({ message: 'Фильм удален!' }); }
          })
          .catch(next);
      } else { throw new ForbiddenError('Доступ запрещен!'); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Фильм с указанным _id: ${movieId} не найден.`));
      } else if (err.name === 'TypeError') {
        next(new NotFoundError(`Фильм с указанным _id: ${movieId} не найден.`));
      } else { next(err); }
    });
};
