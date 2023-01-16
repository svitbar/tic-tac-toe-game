'use strict';

const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'f32*AG17re9!',
  database: 'register_db'
});

module.exports = db;
