const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { setError } = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limit');
const router = require('./routes');

const { MONGODB_URI } = process.env;

const app = express();

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

app.use(requestLogger);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://api.mary.diplom.nomoredomains.monster',
    'http://api.mary.diplom.nomoredomains.monster',
  ],
  credentials: true,
}));
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use(setError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
