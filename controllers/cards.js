const Card = require('../models/card');
const BadRequestErr = require('../errors/bad-request');
const NotFoundErr = require('../errors/not-found');
const ForbiddenErr = require('../errors/forbidden');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка получения списка карточек' }));
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr(error.message));
      } else {
        next(error);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(() => new NotFoundErr('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenErr('Нельзя удалить чужую карточку');
      } else {
        card.deleteOne(card)
          .then(() => res.send(card));
      }
    })
    .catch(next);
};

const updateLike = (req, res, next, method) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { [method]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundErr('Передан несуществующий _id карточки'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => updateLike(req, res, next, '$addToSet');

const dislikeCard = (req, res, next) => updateLike(req, res, next, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
