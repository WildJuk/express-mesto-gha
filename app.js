require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const UnknowErr = require('./middlewares/unknow-err');
const router = require('./routes');
const { DATA_BASE_URI, PORT } = require('./config');

const app = express();

mongoose.connect(DATA_BASE_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(UnknowErr);
app.listen(PORT, () => console.log('Сервер запущен'));
