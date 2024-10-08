const catchAsync =require('./../utils/catchAsync');
const bookingModel =require('./../models/bookingModel');
const factory = require('./factoryController');
const {pay} = require('./../public/js/checkout');
const {createHmac} = require('crypto');







exports.getAllReviews=factory.getAll(bookingModel);
exports.createNewReview =factory.createOne(bookingModel);
exports.deleteReview = factory.deleteOne(bookingModel);
exports.updateReview =factory.updateOne(bookingModel);
exports.getSingleReview = factory.getSingleOne(bookingModel);



exports.checkout = catchAsync(async (req ,res ,next)=>{
    const billing_data ={
        apartment: 'NA', 
        email: req.user.email, 
        floor: 'NA', 
        first_name: req.user.name.split(' ')[0], 
        street: 'NA', 
        building: 'NA', 
        phone_number: '000 000 000', 
        shipping_method: 'NA', 
        postal_code: 'NA', 
        city: 'NA', 
        country: 'NA', 
        last_name: req.user.name.split(' ')[1] ||'Ashraf', 
        state: 'NA'
    }
    const itemsArr =[];
    itemsArr.push(JSON.parse(req.body.items));  //for testing in the browser
   /*  itemsArr.push(req.body.items); */  //for testing in the postman
    /* console.log(itemsArr[0]); */
    const token =await pay(req.body.price , itemsArr ,billing_data );
    req.bookedTour =itemsArr[0];
    const link =`https://accept.paymob.com/api/acceptance/iframes/798819?payment_token=${token}`;
   /*  console.log(iframeLink); */
    const book = await bookingModel.create({
    user :req.user.id ,
    tour :req.bookedTour.tourId ,
    price :req.bookedTour.price
    })
    console.log(book);
    res.status(200).json({
        status: 'success',
        link 
    })
});




exports.processed =catchAsync(async (req ,res ,next) =>{
    const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order: { id: order_id },
        owner,
        pending,
        source_data: {
            pan: source_data_pan,
            sub_type: source_data_sub_type,
            type: source_data_type,
        },
        success,} = req.body.obj;
    
      // Create a lexogragical string with the order specified by Paymob @ https://docs.paymob.com/docs/hmac-calculation
    let lexogragical =
        amount_cents +
        created_at +
        currency +
        error_occured +
        has_parent_transaction +
        id +
        integration_id +
        is_3d_secure +
        is_auth +
        is_capture +
        is_refunded +
        is_standalone_payment +
        is_voided +
        order_id +
        owner +
        pending +
        source_data_pan +
        source_data_sub_type +
        source_data_type +
        success;
    
      // Create a hash using the lexogragical string and the HMAC key
    let hash = createHmac("sha512", process.env.HMAC_KEY)
        .update(lexogragical)
        .digest("hex");
    
      // Compare the hash with the hmac sent by Paymob to verify the request is authentic
    if (hash === req.query.hmac) {
        // the request is authentic and you can store in the db whtever you want
        const book = await bookingModel.create({
            user :req.user.id ,
            tour :req.bookedTour.tourId ,
            price :req.bookedTour.price
        })
        res.status(200).json({
            status  : 'success' ,
            data:book
        })
    }

});