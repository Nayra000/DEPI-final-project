/* import '@babel/polyfill';  */
import { displayMap } from "./mapbox";
import {loginUser ,logoutUser} from "./login"
import {updateMyData} from "./updateSettings"
import {checkout} from './checkoutBooking'





const map =document.getElementById('map');
if(map){
    const loactions =JSON.parse(map.dataset.locations);
    displayMap(loactions);
}

const logginForm = document.querySelector('.login--form');
if(logginForm){
    logginForm.addEventListener('submit' ,(e)=>{
        e.preventDefault();
        const email =document.getElementById('email').value;
        const password =document.getElementById('password').value;
        loginUser('signin' ,{email  ,password});
    })
}

const signupForm =document.querySelector('.signup--form');
if(signupForm){
    signupForm.addEventListener('submit' ,(e)=>{
        e.preventDefault();
        const name =document.getElementById('name').value;
        const email =document.getElementById('email').value;
        const password =document.getElementById('password').value;
        const passwordConfirm =document.getElementById('passwordConfirm').value;
        loginUser('signup',{name ,email ,password ,passwordConfirm}) ;
    })

}

const logoutBtn =document.querySelector('.nav__el--logout');
if(logoutBtn){
    logoutBtn.addEventListener('click',logoutUser);
}

const userDataForm =document.querySelector('.form-user-data');
if(userDataForm){
    userDataForm.addEventListener('submit',async (e)=>{
        e.preventDefault();
        const form = new FormData();
        form.append('name' ,document.getElementById('name').value);
        form.append('email' ,document.getElementById('email').value);
        form.append('photo' ,document.getElementById('photo').files[0]);
        await updateMyData('data' ,form);
    });
}
const userPasswordForm = document.querySelector('.form-user-password');
if(userPasswordForm){
    userPasswordForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const currentPassword =document.getElementById('password-current').value;
        const password =document.getElementById('password').value;
        const passwordConfirm =document.getElementById('password-confirm').value;
        const saveBtn =document.querySelector('.save-btn');

        saveBtn.innerText ='Updating...';

        await updateMyData('password',{currentPassword ,password ,passwordConfirm});

        saveBtn.innerText ='Save password';

        document.getElementById('password-current').value="";
        document.getElementById('password').value ="";
        document.getElementById('password-confirm').value ="";
    })
}

const bookBtn =document.getElementById('bookingBtn');
if(bookBtn){
    bookBtn.addEventListener('click' ,(e)=>{
        e.target.textContent = 'Processing...';
        const {tourPrice ,tourItem} = e.target.dataset;
        checkout(tourPrice ,tourItem);
       /*  e.target.textContent = 'Book Tour Now !'; */
    })

}