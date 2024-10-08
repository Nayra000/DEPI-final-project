
const { default: axios } = require("axios");


const authenticate = async ()=>{
    try{
        const url ='https://accept.paymob.com/api/auth/tokens';
        const data ={
            api_key :process.env.PAY_API
        }
        const response =await axios ({
            url ,
            method : 'POST', 
            data
        })
        return response.data.token;
    }
    catch(error){
        console.log('Error Authentication' ,error.response.data);
    }
}

exports.pay =async ( price , items ,billing_data )=>{
    try{
        
        const auth_token =await authenticate();
        //order Registration
        const Orderdata ={
                auth_token,
                delivery_needed: "false",
                amount_cents: price,
                currency: "EGP",
                items
        }
        const orderRes =await axios ({
            url :"https://accept.paymob.com/api/ecommerce/orders" ,
            method:"POST",
            data :Orderdata
        })
        const orderId = orderRes.data.id;
    
        //payment
        const paymentData = {
            auth_token,
            amount_cents :price,
            expiration: 3600,
            order_id: orderId,
            billing_data,
            currency: "EGP",
            integration_id: 4326594
        }
        const payRes =await axios ({
            url :"https://accept.paymob.com/api/acceptance/payment_keys" ,
            method:"POST",
            data :paymentData
        })
        
        return payRes.data.token ;

    }
    catch(err){
        console.log(err.respose);
    }

}