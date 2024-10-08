const express = require('express');

const Router = express.Router({mergeParams :true});

const reviewController =require('./../controllers/reviewController');
const authController =require('./../controllers/authController');


Router.use(authController.protect);

Router.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect,authController.restrictTo('user'),
reviewController.setTourUserIds,reviewController.checkUserBookedTour,reviewController.createNewReview);

Router.route('/:id')
.get(reviewController.getSingleReview)
.patch(authController.restrictTo('user' ,'admin')
,reviewController.updateReview)
.delete(authController.restrictTo('user' ,'admin') ,
reviewController.deleteReview);


module.exports =Router;