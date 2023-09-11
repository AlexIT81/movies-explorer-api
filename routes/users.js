const router = require('express').Router();

const {
  getUserInfo,
  updateProfile,
} = require('../controllers/users');

const {
  updateProfileValidation,
} = require('../middlewares/validation');

router.get('/me', getUserInfo);
router.patch('/me', updateProfileValidation, updateProfile);

module.exports = router;
