/* import '@babel/polyfill';  */ const $f60945d37f8e594c$export$4c5dd147b21b9176 = (loactions)=>{
    var map = L.map("map", {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        touchZoom: false
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    let points = [];
    Array.from(loactions).forEach((loc)=>{
        points.push([
            loc.coordinates[1],
            loc.coordinates[0]
        ]);
        L.marker([
            loc.coordinates[1],
            loc.coordinates[0]
        ]).addTo(map);
    });
    const bounds = L.latLngBounds(points).pad(0.5);
    map.fitBounds(bounds);
    map.scrollWheelZoom.disable();
};


/* import axios from "axios"; */ const $c67cb762f0198593$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $c67cb762f0198593$export$de026b00723010c1 = (type, msg)=>{
    console.log(msg);
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($c67cb762f0198593$export$516836c6a9dfc573, 5000);
};


const $70af9284e599e604$export$692b4a7cc7a486ce = async (type, data)=>{
    try {
        const res = await axios({
            method: "POST",
            url: type === "signin" ? "http://localhost:5000/api/v1/users/singin" : "http://localhost:5000/api/v1/users/signup",
            data: data
        });
        if (res.data.status === "success") {
            (0, $c67cb762f0198593$export$de026b00723010c1)("success", `${type.toUpperCase()} successfully!`);
            window.setTimeout(()=>{
                location.assign("/");
            }, 1000);
        }
    } catch (err) {
        console.log(err);
        (0, $c67cb762f0198593$export$de026b00723010c1)("error", err.response.data.message);
    }
};
const $70af9284e599e604$export$e8df664d4863167e = async ()=>{
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:5000/api/v1/users/logout"
        });
        if (res.data.status === "success") {
            (0, $c67cb762f0198593$export$de026b00723010c1)("success", "Logged out successfully!");
            window.setTimeout(()=>{
                location.reload(true);
                location.assign("/");
            }, 1000);
        }
    } catch (err) {
        console.log(err);
        (0, $c67cb762f0198593$export$de026b00723010c1)("error", err.response.data.message);
    }
};


/* import axios from "axios" */ 
const $936fcc27ffb6bbb1$export$1bfa820af5bb4b7c = async (type, data)=>{
    try {
        const res = await axios({
            url: type === "password" ? "http://localhost:5000/api/v1/users/updatePassword" : "http://localhost:5000/api/v1/users/updateMe",
            method: "PATCH",
            data: data
        });
        console.log(res);
        if (res.data.status === "success") {
            (0, $c67cb762f0198593$export$de026b00723010c1)("success", `${type.toUpperCase()} updated successfully`);
            window.setTimeout(()=>{
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        (0, $c67cb762f0198593$export$de026b00723010c1)("error", err.response.data.message);
    }
};


const $12e4c09e240ceffa$export$f0bf07efc4a101de = async (price, items)=>{
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:5000/api/v1/bookings/checkout",
            data: {
                price: price,
                items: items
            }
        });
        /* console.log(res.data); */ if (res.data.status === "success") window.setTimeout(()=>{
            location.assign(res.data.link);
        }, 1000);
    } catch (err) {
        console.log(err.response.data.message);
    }
};


const $d0f7ce18c37ad6f6$var$map = document.getElementById("map");
if ($d0f7ce18c37ad6f6$var$map) {
    const loactions = JSON.parse($d0f7ce18c37ad6f6$var$map.dataset.locations);
    (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(loactions);
}
const $d0f7ce18c37ad6f6$var$logginForm = document.querySelector(".login--form");
if ($d0f7ce18c37ad6f6$var$logginForm) $d0f7ce18c37ad6f6$var$logginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $70af9284e599e604$export$692b4a7cc7a486ce)("signin", {
        email: email,
        password: password
    });
});
const $d0f7ce18c37ad6f6$var$signupForm = document.querySelector(".signup--form");
if ($d0f7ce18c37ad6f6$var$signupForm) $d0f7ce18c37ad6f6$var$signupForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    (0, $70af9284e599e604$export$692b4a7cc7a486ce)("signup", {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
    });
});
const $d0f7ce18c37ad6f6$var$logoutBtn = document.querySelector(".nav__el--logout");
if ($d0f7ce18c37ad6f6$var$logoutBtn) $d0f7ce18c37ad6f6$var$logoutBtn.addEventListener("click", (0, $70af9284e599e604$export$e8df664d4863167e));
const $d0f7ce18c37ad6f6$var$userDataForm = document.querySelector(".form-user-data");
if ($d0f7ce18c37ad6f6$var$userDataForm) $d0f7ce18c37ad6f6$var$userDataForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    await (0, $936fcc27ffb6bbb1$export$1bfa820af5bb4b7c)("data", form);
});
const $d0f7ce18c37ad6f6$var$userPasswordForm = document.querySelector(".form-user-password");
if ($d0f7ce18c37ad6f6$var$userPasswordForm) $d0f7ce18c37ad6f6$var$userPasswordForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    const saveBtn = document.querySelector(".save-btn");
    saveBtn.innerText = "Updating...";
    await (0, $936fcc27ffb6bbb1$export$1bfa820af5bb4b7c)("password", {
        currentPassword: currentPassword,
        password: password,
        passwordConfirm: passwordConfirm
    });
    saveBtn.innerText = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
});
const $d0f7ce18c37ad6f6$var$bookBtn = document.getElementById("bookingBtn");
if ($d0f7ce18c37ad6f6$var$bookBtn) $d0f7ce18c37ad6f6$var$bookBtn.addEventListener("click", (e)=>{
    e.target.textContent = "Processing...";
    const { tourPrice: tourPrice, tourItem: tourItem } = e.target.dataset;
    (0, $12e4c09e240ceffa$export$f0bf07efc4a101de)(tourPrice, tourItem);
/*  e.target.textContent = 'Book Tour Now !'; */ });


//# sourceMappingURL=bundle.js.map
