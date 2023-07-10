const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const validUrlAdressRegEx = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/i;

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
    link: Joi.string().required().pattern(validUrlAdressRegEx),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().required().email(),
    avatar: Joi.string().pattern(validUrlAdressRegEx),
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
    avatar: Joi.string().required().pattern(validUrlAdressRegEx),
  },
});

const validateProfileInfo = celebrate({
  body: {
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  },
});

module.exports = {
  validUrlAdressRegEx,
  validateObjectId,
  validateCardInfo,
  validateUserInfo,
  validateAuthInfo,
  validateAvatarInfo,
  validateProfileInfo,
};
