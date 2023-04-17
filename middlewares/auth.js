const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const Unauthorized = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Unauthorized('Необходима авторизация');
    return next(error);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    const error = new Unauthorized('Необходима авторизация');
    return next(error);
  }
  req.user = payload;

  return next();
};
