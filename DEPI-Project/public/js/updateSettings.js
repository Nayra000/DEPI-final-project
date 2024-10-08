/* import axios from "axios" */
import {showAlert} from './alert';




export const updateMyData = async (type , data)=>{
    try{
        const res =await axios({
            url :type ==='password' ? 'http://localhost:5000/api/v1/users/updatePassword' :'http://localhost:5000/api/v1/users/updateMe',
            method:'PATCH' ,
            data 
        })
        console.log(res);
        if(res.data.status ==='success'){
            showAlert('success',`${type.toUpperCase()} updated successfully`);
            window.setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    }catch(err){
            showAlert('error',err.response.data.message);
    }
}