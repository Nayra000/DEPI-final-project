const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const globalErrorHandler = require('./controllers/errorController');
const usersRouter = require('./routers/userRouter');
const toursRouter = require('./routers/tourRouter');
const bookingRouter = require('./routers/bookingRouter');
const reviewsRouter = require('./routers/reviewRouter');
const viewRouter = require('./routers/viewRouter');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

app.use(cors());
//set security http header
/* app.use(helmet()); */
const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org'];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/'
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* app.use(
    helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
})
); */


//limit requests from the same IP
const limiter = rateLimit({
    max: 100,
    window: 60 * 60 * 1000,
    message: 'To many requests from the same IP , please try again in an hour'
})
app.use('/api', limiter)

//parse incoming request with json
app.use(express.json({ limit: '10kb' }))

//parse data coming from form
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price']
}));

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
//Test middelwares
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})
//Define view engine 
app.set('view engine', 'pug');

//Define where views are located in filesystem
app.set('views', path.join(__dirname, 'views'));

//Routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/reviews', reviewsRouter)
app.use('/api/v1/bookings', bookingRouter);
app.use('/', viewRouter)






//To handel unhandeled routes
//all mean all http methods
app.all('*', (req, res, next) => {
    /*   res.status(404).json({
          "status":"fail" ,
          "message":"Unhandeled route"
      }) */
    next(new AppError('Unhandeled route', 404));
})

app.use(globalErrorHandler)
module.exports = app;