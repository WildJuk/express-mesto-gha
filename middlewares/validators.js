const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const urlRegExp = new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$');

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
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
    link: Joi.string().required().pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом')
      .messages({
        'string.empty': 'Поле "link" должно быть заполнено',
      }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Поле "password" должно быть заполнено',
      }),
    email: Joi.string().required().email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.empty': 'Поле "email" должно быть заполнено',
      }),
    avatar: Joi.string()
      .pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом'),
  }),
});

const validateAuthInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Поле "password" должно быть заполнено',
      }),
  }),
});

const validateAvatarInfo = celebrate({
  body: {
    avatar: Joi.string().required().pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом')
      .messages({
        'string.empty': 'Поле "avatar" должно быть заполнено',
      }),
  },
});

const validateProfileInfo = celebrate({
  body: {
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
      }),
  },
});

module.exports = {
  urlRegExp,
  validateObjectId,
  validateCardInfo,
  validateUserInfo,
  validateAuthInfo,
  validateAvatarInfo,
  validateProfileInfo,
};
