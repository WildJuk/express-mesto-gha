require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const UnknowErr = require('./middlewares/unknow-err');
const router = require('./routes');

const { PORT } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(UnknowErr);
app.listen(PORT, () => console.log('Сервер запущен'));
