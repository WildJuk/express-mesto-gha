const { PORT = 3000 } = process.env;
const { NODE_ENV = 'production' } = process.env;
const { JWT_SECRET = '13732e46ef237e0b02886e5bd8285b3661274e88b5a0456aadee31f8bfcd03b2' } = process.env;
const { DATA_BASE_URI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  DATA_BASE_URI,
};
