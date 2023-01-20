'use strict';

const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

router.route('/profile')
  .get(controller.getAll)
  .post(controller.createProfile);

router.route('/profile/:id')
  .get(controller.getOne)
  .put(controller.updateProfile)
  .delete(controller.deleteUser);

module.exports = router;
