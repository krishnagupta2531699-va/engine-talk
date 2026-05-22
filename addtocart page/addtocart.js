let cart = JSON.parse(localStorage.getItem("cart")) || [];

let container = document.getElementById("cartContainer");
let total = 0;

function loadCart(){

container.innerHTML="";
total=0;

for(let i=0;i<cart.length;i++){

let item=cart[i];

let div=document.createElement("div");
div.className="cartItem";

let name=document.createElement("h3");
name.innerText=item.name;

let price=document.createElement("p");
price.innerText="$"+item.price;

let btn=document.createElement("button");
btn.innerText="Remove";

btn.onclick=function(){
removeItem(i);
};

div.appendChild(name);
div.appendChild(price);
div.appendChild(btn);

container.appendChild(div);

total += parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
}

document.getElementById("totalPrice").innerText = total.toLocaleString();

}

function removeItem(index){

cart.splice(index,1);

localStorage.setItem("cart",JSON.stringify(cart));

loadCart();

}

function clearCart(){

localStorage.removeItem("cart");

cart=[];

loadCart();

}

loadCart();





