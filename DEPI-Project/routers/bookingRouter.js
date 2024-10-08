

const bookingController =require('./../controllers/bookingController');
const authController = require('./../controllers/authController');
const express = require('express');
const Router =express.Router({mergeParams: true});




Router.use(authController.protect);

Router.post('/checkout' ,bookingController.checkout);
Router.post('/processed' ,bookingController.processed);




/* Router.use(authController.restrictTo('admin', 'lead-guide')); */
Router.route('/')
.get(bookingController.getAllReviews)
.post(bookingController.createNewReview);

Router.route('/:id')
.get(bookingController.getSingleReview)
.patch(bookingController.updateReview)
.delete(bookingController.deleteReview);



module.exports =Router;