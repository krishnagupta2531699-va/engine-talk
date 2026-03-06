



//------------------Login----------------------------------//
  const user = localStorage.getItem("userName");

  if (user) {
    document.getElementById("welcomeUser").innerText = "Welcome, " + user;
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline";
  }

  function logout() {
    localStorage.clear();
    location.reload();
  }
//-----------------------------------------------------------//



//------------------Cart------------------------------------//
function addToCart(name, price){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let item=({
    name: name,
    price: price,
 
});
cart.push(item);
localStorage.setItem("cart", JSON.stringify(cart));
alert(`${name} Added to cart`);
}

//---------------------------------------------------------//