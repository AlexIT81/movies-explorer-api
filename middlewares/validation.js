const { celebrate, Joi } = require('celebrate');
const { REGEXP_URL } = require('../utils/constants');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(REGEXP_URL).required(),
    trailerLink: Joi.string().pattern(REGEXP_URL).required(),
    thumbnail: Joi.string().pattern(REGEXP_URL).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
    // owner: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  loginValidation,
  createUserValidation,
  updateProfileValidation,
  movieIdValidation,
  createMovieValidation,
};
