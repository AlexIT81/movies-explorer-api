const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  CREATED_OK_CODE,
  SECRET_KEY,
} = require('../utils/constants');

const {
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.status(CREATED_OK_CODE).send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует!'));
      } else { next(err); }
    });
};

// patch users/me
module.exports.updateProfile = (req, res, next) => {
  const owner = req.user._id;
  const { email, name } = req.body;
  User.findOneAndUpdate(
    { _id: owner },
    { $set: { email, name } },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные при обновлении профиля.' }));
      } else if (err.name === 'CastError') {
        next(new NotFoundError({ message: `Пользователь по указанному id:${owner} не найден.` }));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует!'));
      } else { next(err); }
    });
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.send({ token, message: 'Авторизация успешна!' });
      // res.cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      //    .send({ message: 'Авторизация успешна!' });
    })
    .catch(next);
};

// get users/me
module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      }
      res.send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя!'));
      } else { next(err); }
    });
};
