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
router.get('/:id', getUser);
router.get('/me', validateObjectId, getCurrentUser);
router.patch('/me', validateAvatarInfo, updateUserInfo);
router.patch('/me/avatar', validateProfileInfo, updateUserAvatar);

module.exports = router;
