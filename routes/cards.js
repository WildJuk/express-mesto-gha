const router = require('express').Router();
const {
  validateObjectId,
  validateCardInfo,
} = require('../middlewares/validators');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCardInfo, createCard);
router.delete('/:id', validateObjectId, deleteCard);
router.put('/:id/likes', validateObjectId, likeCard);
router.delete('/:id/likes', validateObjectId, dislikeCard);

module.exports = router;
