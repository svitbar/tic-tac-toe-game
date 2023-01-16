'use strict';

const express = require('express');
const db = require('../config/config.js');

const router = express.Router();

const post = 'INSERT INTO USER(USERNAME, EMAIL, PASSWORD) VALUES (?)';
const getAll = 'SELECT * FROM USER';

router.get('/', (req, res) => {

  db.query(getAll, (err, results) => {

    if (err) return res.status(500).send({
      status: 500,
      error: `${err.toString()}`
    });

    return res.status(200).send(results);
  });
});

router.post('/register', (req, res) => {
  const dataBody = req.body;
  const data = [dataBody.username, dataBody.email, dataBody.password];

  if (!data[0] && !data[1] && data[2]) return res.status(400).send({
    status: 404,
    error: 'Name, email and password are required'
  });

  db.query(post, [data], (err, row) => {

    if (err) return res.status(500).send({
      status: 500,
      error: `${err.toString()}`
    });

    return res.status(200).send(row);
  });
});

module.exports = router;
