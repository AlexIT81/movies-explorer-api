require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { PORT = 3000, NODE_ENV, DB_ADDRESS } = process.env;
const app = express();
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADDRESS_LOCAL } = require('./utils/constants');
const handleError = require('./middlewares/handleError');
const limiter = require('./middlewares/rateLimit');
const router = require('./routes');

app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const DB_URL = NODE_ENV === 'production' ? DB_ADDRESS : DB_ADDRESS_LOCAL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
})
  .then(() => console.log(`Подключена база данных по адресу ${DB_URL}`))
  .catch((err) => console.log(err));

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(handleError);

app.listen(PORT);
