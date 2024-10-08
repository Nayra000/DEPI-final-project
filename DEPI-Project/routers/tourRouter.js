const express =require('express');
const tourController =require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter =require('./reviewRouter');
const bookingsRouter = require('./bookingRouter');

const Router =express.Router();

/* Router.param('id' ,tourController.checkId)  / */ //These special type pf middleware is called param middleware and execute only for a specail parameter in the url 

//Do not forget to enable mergeParams in reviewRouter to be able access the tourId
Router.use('/:tourId/reviews' , reviewRouter)

Router.use('/:tourId/bookings' , bookingsRouter)

Router.route('/top-5-cheapest' ).get(tourController.getAllTours);

Router.route('/tour-states').get(tourController.tourStates)

Router.route('/')
.get(tourController.getAllTours)
.post(authController.protect,authController.restrictTo('admin' ,'lead-guide' ),tourController.createNewTour);

Router.route('/:id')
.get(tourController.getSingleTour)
.patch(authController.protect,authController.restrictTo('admin' ,'lead-guide' ),tourController.uploadTourImages,tourController.resizeTourImages,tourController.updateTour)
.delete(authController.protect,authController.restrictTo('admin' ,'lead-guide' ),tourController.deleteTour);

Router.route('/monthly-plane/:year').get(authController.protect,authController.restrictTo('admin' ,'lead-guide','guide' ),tourController.getMonthlyPlane);

Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
Router.route('/distance/:latlng/unit/:unit').get(tourController.getDistance);


//Code below suffer from repeation and coupling the solutin is using express middelware
// Router.route('/:tourId/reviews').post(authController.protect ,authController.restrictTo('user') ,reviewController.createNewReview);



module.exports =Router;