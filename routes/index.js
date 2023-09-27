const router = require('express').Router();

const {
  login,
  createUser,
} = require('../controllers/users');

const { loginValidation, createUserValidation } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.all('*', () => {
  throw new NotFoundError('Такого не существует(');
});

module.exports = router;
