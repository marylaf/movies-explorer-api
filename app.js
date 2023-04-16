const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { setError } = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://api.mary.diplom.nomoredomains.monster',
    'http://api.mary.diplom.nomoredomains.monster',
  ],
  credentials: true,
}));
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use(setError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
