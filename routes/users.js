const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const {
  validateObjectId,
  validateAvatarInfo,
  validateProfileInfo,
} = require('../middlewares/validators');

console.log('here we are 111');
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateObjectId, getUser);
router.patch('/me', validateAvatarInfo, updateUserInfo);
router.patch('/me/avatar', validateProfileInfo, updateUserAvatar);

module.exports = router;
