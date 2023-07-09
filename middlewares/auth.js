const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET = 'JWT_SECRET' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedErr('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

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
