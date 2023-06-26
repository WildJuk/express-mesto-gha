const User = require('../models/user');

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

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка получения списка пользователей' }));
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(400).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id пользователя' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Ошибка получения данных пользователя' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: createValidationErrorMessage(err) });
      } else {
        res.status(500).send({ message: 'Произошла ошибка при создании пользователя' });
      }
    });
};

const updateUserData = (res, req, config = {}) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, config)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: createValidationErrorMessage(err) });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id пользователя' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Ошибка обновления данных пользователя' });
      }
    });
};

const updateUserInfo = (req, res) => updateUserData(res, req, {
  new: true,
  runValidators: true,
  upsert: true,
});

const updateUserAvatar = (req, res) => {
  const { body } = req;
  if (!body.avatar) {
    return res.status(400).send({ message: 'Поле avatar не заполнено' });
  }
  return updateUserData(res, req, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
