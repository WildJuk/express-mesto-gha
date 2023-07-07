const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { token } = req.cookies.jwt;
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
