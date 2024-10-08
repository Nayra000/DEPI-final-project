export const checkout=async (price ,items) =>{
    try{  
        const res = await axios({
                method:'POST' ,
                url:'http://localhost:5000/api/v1/bookings/checkout' ,
                data:{price , items}
        }) 
        /* console.log(res.data); */
        if (res.data.status === 'success') {
            window.setTimeout(() => {
                location.assign(res.data.link);
            }, 1000);
        }
    }
    catch(err){
        console.log(err.response.data.message);
    }

}