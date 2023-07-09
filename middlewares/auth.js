const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET = 'JWT_SECRET' } = process.env;

const auth = (req, res, next) => {
  if (!req.headers.cookie || !req.headers.cookie.startsWith('token=')) {
    next(new UnauthorizedErr('Необходима авторизация'));
  }
  const token = req.headers.cookie.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    next(new UnauthorizedErr('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
