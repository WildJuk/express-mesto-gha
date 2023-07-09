const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const regex = /^http(s)?:\/\/(www.)?([a-z0-9\-._~:/?#[]@!\$&'()\*\+,;=])/;

const validateObjectId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Некорректный id');
    }),
  }),
});

const validateCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().required().email(),
    avatar: Joi.string().pattern(regex),
  }),
});

const validateAuthInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateAvatarInfo = celebrate({
  body: {
    avatar: Joi.string().required().pattern(regex),
  },
});

const validateProfileInfo = celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  },
});

module.exports = {
  regex,
  validateObjectId,
  validateCardInfo,
  validateUserInfo,
  validateAuthInfo,
  validateAvatarInfo,
  validateProfileInfo,
};
