const Card = require('../models/card');

const createErrorMessageFromErrorType = (error) => {
  const errorTextFromTypes = {
    minlength: 'не должно быть короче',
    maxlength: 'не должно быть длиннее',
    required: 'обязательно для заполнения',
  };
  if (error.kind === 'required') {
    return `Поле ${error.path} ${errorTextFromTypes.required}`;
  }
  if (error.kind === 'maxlength' || error.kind === 'minlength') {
    return `Поле ${error.path} ${errorTextFromTypes[error.kind]} ${error.properties[error.kind]} символов`;
  }
  return `${error.message}`;
};

const createValidationErrorMessage = (error) => {
  const fieldsErrors = Object.values(error.errors);
  const errorText = fieldsErrors.map((item) => createErrorMessageFromErrorType(item));
  return errorText.join(', ');
};

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
          .send({ message: createValidationErrorMessage(err) });
      } else {
        res.status(500).send({ message: 'Произошла ошибка при создании карточки' });
      }
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
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
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
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
