let isSignup = false;

function toggleForm() {
  isSignup = !isSignup;

  const nameField = document.getElementById("name");
  const title = document.getElementById("formTitle");
  const button = document.querySelector("button");
  const toggleText = document.getElementById("toggleText");

  if (isSignup) {
    nameField.style.display = "block";
    title.innerText = "Sign Up";
    button.innerText = "Sign Up";
    toggleText.innerText = "Already have an account?";
  } else {
    nameField.style.display = "none";
    title.innerText = "Login";
    button.innerText = "Login";
    toggleText.innerText = "New user?";
  }
}

function submitForm() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  if (email === "" || password === "") {
    message.style.color = "red";
    message.innerText = "Please fill all fields!";
    return;
  }

  if (isSignup) {
    if (name === "") {
      message.style.color = "red";
      message.innerText = "Enter your name!";
      return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    message.style.color = "lightgreen";
    message.innerText = "Account Created Successfully!";
  } else {
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (email === storedEmail && password === storedPassword) {
      message.style.color = "lightgreen";
      message.innerText = "Login Successful!";
      window.location.href = "home.html";
    } else {
      message.style.color = "red";
      message.innerText = "Invalid Email or Password!";
    }
  }
}