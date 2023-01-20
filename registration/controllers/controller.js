'use strict';

const db = require('../config/config.js');

const sql = {

  createUser: 'INSERT INTO USER(USERNAME, EMAIL, PASSWORD) VALUES (?)',

  getAllUsers: 'SELECT * FROM USER',
  getUserById: 'SELECT * FROM USER WHERE ID=?',
  getUserByName: 'SELECT * FROM USER WHERE USERNAME=?',

  updateUserInfo: 'UPDATE USER SET USERNAME=?, EMAIL=?, PASSWORD=? WHERE ID=?',

  deleteUserById: 'DELETE FROM USER WHERE ID=?'

};

const getAll = (req, res) => {

  db.query(sql.getAllUsers, (err, results) => {

    if (err) return res.status(500).send({
      status: 500,
      error: `${err.toString()}`
    });

    return res.status(200).send(results);
  });

};

const getOne = (req, res) => {

  db.query(sql.getUserById, [req.params.id], (err, result) => {

    if (err) return res.status(500).send({
      status: 500,
      error: `${err.toString()}`
    });

    if (result.length === 0) return res.status(404).send({
      status: 404,
      error: 'No user with such id'
    });

    return res.status(200).send(result);
  });

};

const createProfile = (req, res) => {

  const dataBody = req.body;
  const data = [dataBody.username, dataBody.email, dataBody.password];

  if (!data[0] || !data[1] || !data[2]) return res.status(400).send({
    status: 404,
    error: 'All fields are required'
  });

  db.query(sql.getUserByName, [data[0]], (err, result) => {

    if (err) return res.status(500).send({
      status: 500,
      error: `${err.toString()}`
    });

    if (result.length !== 0) return res.status(406).send({
      status: 406,
      error: 'There is already profile with such username'
    });

    db.query(sql.createUser, [data], (error, row) => {

      if (error) return res.status(500).send({
        status: 500,
        error: `${err.toString()}`
      });

      return res.status(200).send(row);
    });
  });
};

const updateProfile = (req, res) => {

  const dataBody = req.body;

  const data = [
    dataBody.username,
    dataBody.email,
    dataBody.password,
    req.params.id
  ];

  if (!data[0] || !data[1] || !data[2]) return res.status(400).send({
    status: 404,
    error: 'All fields are required'
  });

  db.query(sql.getUserById, [req.params.id], (err, result) => {

    if (err) return res.status(500).send({
      status: 500,
      error: `${err.toString()}`
    });

    if (result.length === 0) return res.status(404).send({
      status: 404,
      error: 'No profile with such id'
    });

    db.query(sql.updateUserInfo, data, (error, row) => {

      if (error) return res.status(500).send({
        status: 500,
        error: `${error.toString()}`
      });

      return res.status(200).send(row);
    });
  });
};

const deleteUser = (req, res) => {

  db.query(sql.getUserById, [req.params.id], (err, result) => {

    if (err) return res.status(500).send({
      status: 500,
      error: `${err.toString()}`
    });

    if (result.length === 0) return res.status(404).send({
      status: 404,
      error: 'No profile with such id'
    });

    db.query(sql.deleteUserById, [req.params.id], (error, row) => {

      if (error) return res.status(500).send({
        status: 500,
        error: `${error.toString()}`
      });
      return res.status(200).send(row);
    });

  });

};

module.exports = {
  getAll,
  getOne,
  createProfile,
  updateProfile,
  deleteUser,
};
