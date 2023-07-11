const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/not-found');
const BadRequestErr = require('../errors/bad-request');
const ConflictErr = require('../errors/conflict');
const {
  NODE_ENV,
  JWT_SECRET,
} = require('../config');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserInfo = (id, res, next) => {
  User.findById(id)
    .orFail(() => new NotFoundErr('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  getUserInfo(req.params.id, res, next);
};

const getCurrentUser = (req, res, next) => {
  getUserInfo(req.user._id, res, next);
};

const createUser = (req, res, next) => {
  const newUser = req.body;
  bcrypt.hash(newUser.password, 10)
    .then((hash) => User.create({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      password: hash,
    }))
    .then((user) => {
      const {
        email, name, about, avatar,
      } = user;

      res.status(201).send({
        email, name, about, avatar,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr(error.message));
      } else if (error.code === 11000) {
        next(new ConflictErr('Пользователь с данным email уже существует'));
      } else {
        next(error);
      }
    });
};

const updateUserData = (res, req, next, updatedData) => {
  const { user: { _id } } = req;
  User.findByIdAndUpdate(_id, updatedData, { new: true, runValidators: true })
    .orFail(() => new NotFoundErr('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserInfo = (req, res, next) => updateUserData(
  res,
  req,
  next,
  {
    name: req.body.name,
    about: req.body.about,
  },
);

const updateUserAvatar = (req, res, next) => updateUserData(
  res,
  req,
  next,
  {
    avatar: req.body.avatar,
  },
);

module.exports = {
  login,
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
