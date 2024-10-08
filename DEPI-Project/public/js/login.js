/* import axios from "axios"; */

import {showAlert} from './alert';

export const loginUser=async (type ,data) =>{
    try{  
        const res = await axios({
                method:'POST' ,
                url: type==='signin' ? 'http://localhost:5000/api/v1/users/singin' :'http://localhost:5000/api/v1/users/signup',
                data
        }) 
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} successfully!`);
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    }
    catch(err){
        console.log(err);
        showAlert('error', err.response.data.message);
    }

}

export const logoutUser = async ()=>{
    try{
        const res = await axios({
            method :'GET' ,
            url :'http://localhost:5000/api/v1/users/logout'
        })
        if (res.data.status === 'success') {
            showAlert('success', 'Logged out successfully!');
            window.setTimeout(() => {
                location.reload(true);
                location.assign('/');
            }, 1000);
        }
    }
    catch(err){
        console.log(err);
        showAlert('error', err.response.data.message);   
    }
    

}



