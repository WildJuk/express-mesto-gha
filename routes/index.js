const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const {
  validateUserInfo,
  validateAuthInfo,
} = require('../middlewares/validators');
const {
  createUser,
  login,
} = require('../controllers/users');
const NotFoundErr = require('../errors/not-found');

router.post('/signup', validateUserInfo, createUser);
router.post('/signin', validateAuthInfo, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => {
  next(new NotFoundErr('Страница не найдена'));
});

module.exports = router;
