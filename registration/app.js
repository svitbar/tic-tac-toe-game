'use strict';

const express = require('express');
const db = require('./config/config.js');
const router = require('./routes/router');

const app = express();

const PORT = 5000;

app.use(express.json());
app.use('/', router);

db.connect(() => app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}));
