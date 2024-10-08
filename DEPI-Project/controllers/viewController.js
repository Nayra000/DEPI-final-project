const tourModel = require('./../models/tourModel');
const userModel = require('./../models/userModel');
const bookModel = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bookingModel = require('./../models/bookingModel');


//Based on MVC Arch , we get the data from model and send it to view through controller 
exports.getOverview = catchAsync(async (req, res, next) => {
    let tours;
    if (req.user) {
        const bookedTours = await bookModel.find({ user: req.user._id });
        const toursIds = bookedTours.map((e) => e.tour._id);
        tours = await tourModel.find({ _id: { $nin: toursIds } });
    }
    else {
        tours = await tourModel.find();
    }
    res.status(200).render('overview', { title: 'Natours', tours })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const slug = req.params.slug;
    const tour = await tourModel.findOne({ slug }).populate({ path: "reviews", field: "review rating user" });
    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }
    let isbooked = false;
    /*  console.log(await bookingModel.findOne({tour :tour.id})) */
    if (req.user && await bookingModel.findOne({ tour: tour.id, user: req.user._id })) {
        isbooked = true;
    }

    res.status(200).render('tour', { title: `${tour.name} Tour`, tour, isbooked });
})


exports.getLoginForm = (req, res) => {
    res.status(200).render('login')
}

exports.getAccount = (req, res) => {
    res.status(200).render('account')
}

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await userModel.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).render('account', { title: 'Your account', user: updatedUser });
})

exports.getBookings = catchAsync(async (req, res, next) => {
    const booked = await bookModel.find({ user: req.user._id });
    const tours = booked.map((e) => e.tour);
    /* console.log(tours) */
    res.status(200).render('booking', { title: 'My bookings', tours });
});

exports.register = (req, res) => {
    res.status(200).render('register', { title: 'register' });
}