const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

app.use('/', auth, userRouter);
app.use('/', auth, movieRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
