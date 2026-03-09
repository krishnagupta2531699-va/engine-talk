let car = JSON.parse(localStorage.getItem("editCar"));

if(car){
document.getElementById("carName").innerText = car.name;
document.getElementById("price").innerText = car.price;
document.getElementById("carImage").src = car.image;
}