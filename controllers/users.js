const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/not-found');
const BadRequestErr = require('../errors/bad-request');
const ConflictErr = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt
        .sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  console.log('here we are');
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => new NotFoundErr('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  getUserInfo(req, res, next);
};

const getCurrentUser = (req, res, next) => {
  getUserInfo(req, res, next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
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

const updateUserData = (res, req, next) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .orFail(() => new NotFoundErr('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserInfo = (req, res, next) => updateUserData(res, req, next);

const updateUserAvatar = (req, res, next) => updateUserData(res, req, next);

module.exports = {
  login,
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
