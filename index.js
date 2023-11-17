const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const prefix = '/v1/api/';

// const db = require('./config/db.config'); //Connect to database railway
const db = require('./config/db.local.config'); //Connect to database local

db.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('error'));

app.get('/', (req, res) => {
  res.send('Ok! Server Running!');
});

app.listen(5000 || process.env.PORT, () => {
  console.log('Server Started');
  console.log(`Server Running on http://localhost:${port}`)
});
