const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors');
const { SECRET_KEY } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация!');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY,
    );
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация!'));
  }

  req.user = payload;
  next();
  return req.user;
};

// доработать под куки
// module.exports = (req, res, next) => {
//   const { authorization } = req.cookies;
//   if (!authorization) {
//     throw new UnauthorizedError('Необходима авторизация!');
//   }

//   const token = authorization;
//   let payload;

//   try {
//     payload = jwt.verify(token, SECRET_KEY);
//   } catch (err) {
//     next(new UnauthorizedError('Необходима авторизация!'));
//   }

//   req.user = payload;
//   next();
//   return req.user;
// };
