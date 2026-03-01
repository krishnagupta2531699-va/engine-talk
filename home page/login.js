function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let message = document.getElementById("message");

  if (email === "" || password === "") {
    message.style.color = "red";
    message.innerText = "Please fill all fields!";
  } 
  else if (password.length < 6) {
    message.style.color = "red";
    message.innerText = "Password must be at least 6 characters!";
  }
  else {
    message.style.color = "lightgreen";
    message.innerText = "Login Successful!";
  }
}