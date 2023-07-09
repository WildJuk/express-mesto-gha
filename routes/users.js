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

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateObjectId, getUser);
router.patch('/me', validateProfileInfo, updateUserInfo);
router.patch('/me/avatar', validateAvatarInfo, updateUserAvatar);

module.exports = router;
