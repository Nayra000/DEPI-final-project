const authController = require('./../controllers/authController');
const express = require('express');
const Router = express.Router();
const viewController = require('./../controllers/viewController');

/* Router.use(authController.isLoggedIn); */

Router.get('/', (req, res) => {
  console.log('test route')
  res.status(200).json({
    message: 'success',
  });
});

module.exports = Router;
