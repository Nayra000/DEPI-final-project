

export const displayMap= (loactions)=>{
var map = L.map('map' ,
{   zoomControl :false 
    ,scrollWheelZoom :false
    ,dragging:false , 
    doubleClickZoom:false ,
    touchZoom:false ,
    });
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let points =[];
Array.from(loactions).forEach(loc => {
    points.push([loc.coordinates[1] ,loc.coordinates[0]]);
    L.marker([loc.coordinates[1] ,loc.coordinates[0]]).addTo(map);
});

const bounds = L.latLngBounds(points).pad(0.5);
map.fitBounds(bounds);
map.scrollWheelZoom.disable();
}