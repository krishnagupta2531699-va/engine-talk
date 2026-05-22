// garage.js — simple, beginner-friendly JavaScript

// Track current state
var currentFolder = "ferrari";
var currentColor  = "red";

// Called when a color button is clicked
function changeColor(btn) {
  // Get the chosen color from data-color attribute
  currentColor = btn.dataset.color;

  // Swap the main car image
  document.getElementById("mainCarImg").src =
    "images/cars/" + currentFolder + "/" + currentColor + ".png";

  // Highlight the selected button, remove from others
  var allColorBtns = document.querySelectorAll(".color-btn");
  for (var i = 0; i < allColorBtns.length; i++) {
    allColorBtns[i].classList.remove("active");
  }
  btn.classList.add("active");
}

// Called when a car thumbnail is clicked
function switchCar(thumb) {
  // Get car folder and details from data attributes
  currentFolder = thumb.dataset.folder;

  // Update main image (keep current color)
  document.getElementById("mainCarImg").src =
    "images/cars/" + currentFolder + "/" + currentColor + ".png";

  // Update car details panel
  document.getElementById("carName").innerText   = thumb.dataset.name;
  document.getElementById("carPrice").innerText  = thumb.dataset.price;
  document.getElementById("carBadge").innerText  = thumb.dataset.badge;
  document.getElementById("specEngine").innerText = thumb.dataset.engine;
  document.getElementById("specSpeed").innerText  = thumb.dataset.speed;
  document.getElementById("specTop").innerText    = thumb.dataset.top;
  document.getElementById("specHP").innerText     = thumb.dataset.hp;
  document.getElementById("specYear").innerText   = thumb.dataset.year;
  document.getElementById("specFuel").innerText   = thumb.dataset.fuel;

  // Highlight selected thumbnail, remove from others
  var allThumbs = document.querySelectorAll(".thumb");
  for (var i = 0; i < allThumbs.length; i++) {
    allThumbs[i].classList.remove("active");
  }
  thumb.classList.add("active");
}

// Add to Cart — stores the selected car in localStorage
function addToCart() {
  var name  = document.getElementById("carName").innerText;
  var price = document.getElementById("carPrice").innerText;

  // Read existing cart or start fresh
  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({ name: name, price: price, color: currentColor });
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(name + " (" + currentColor + ") added to cart!");
}
