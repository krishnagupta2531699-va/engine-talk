// LOGIN
const user = localStorage.getItem("userName");

if (user) {
  document.getElementById("welcomeUser").innerText = "👋 Welcome, " + user;
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline";
}

function logout() {
  localStorage.clear();
  location.reload();
}

// CART
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added to cart");
}

// SEARCH
const searchBox = document.getElementById("searchBox");

if (searchBox) {
  searchBox.addEventListener("keyup", function () {
    const value = searchBox.value.toLowerCase();
    const cars = document.querySelectorAll(".car");

    cars.forEach(car => {
      const name = car.querySelector("h3").innerText.toLowerCase();
      car.style.display = name.includes(value) ? "block" : "none";
    });
  });
}