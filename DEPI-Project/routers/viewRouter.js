const authController = require('./../controllers/authController');
const express = require('express');
const Router = express.Router();
const viewController = require('./../controllers/viewController')

/* Router.use(authController.isLoggedIn); */

Router.get('/', authController.isLoggedIn, viewController.getOverview);
Router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
Router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
Router.get('/register', viewController.register);
Router.get('/me', authController.protect, viewController.getAccount);
Router.get('/myBookings', authController.protect, viewController.getBookings);
Router.post('/submit-user-data', authController.protect, viewController.updateUserData);











module.exports = Router;