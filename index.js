// code away!
require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/userRouter');
const bodyParser = require('body-parser');
const app = express();
// app.use(express.json());
app.use(bodyParser());

const logger = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`
  );
  next();
};
app.use(logger);

app.use('/api/users', userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`\n*** Server running on  http://localhost:${port} ***\n`));