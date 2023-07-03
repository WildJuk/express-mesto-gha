const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка получения списка карточек' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка при создании карточки' });
      }
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .orFail(() => {
      const error = new Error('Карточка с указанным _id не найдена');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка при удалении карточки' });
      }
    });
};

const updateLike = (req, res, method) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { [method]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Передан несуществующий _id карточки');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => updateLike(req, res, '$addToSet');

const dislikeCard = (req, res) => updateLike(req, res, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
