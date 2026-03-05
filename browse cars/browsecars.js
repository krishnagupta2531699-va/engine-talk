function addToCart(name, price)
{

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let item = {
name: name,
price: price
};

cart.push(item);

localStorage.setItem("cart", JSON.stringify(cart));

alert(name + " added to cart");

}