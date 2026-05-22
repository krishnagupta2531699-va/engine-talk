// contact.js — Engine Talk Contact Form
// Simple JavaScript: no frameworks, no advanced concepts

// Get the form element
var form = document.getElementById("contactForm");

// Listen for form submit
form.addEventListener("submit", function(event) {

  // Step 1: Stop the page from reloading
  event.preventDefault();

  // Step 2: Read all input values
  var firstName = document.getElementById("firstName").value;
  var lastName  = document.getElementById("lastName").value;
  var email     = document.getElementById("email").value;
  var phone     = document.getElementById("phone").value;
  var interest  = document.getElementById("interest").value;
  var message   = document.getElementById("message").value;

  // Step 3: Print values to the console
  console.log("--- New Contact Form Submission ---");
  console.log("Name:      " + firstName + " " + lastName);
  console.log("Email:     " + email);
  console.log("Phone:     " + phone);
  console.log("Interest:  " + interest);
  console.log("Message:   " + message);
  console.log("-----------------------------------");

  // Step 4: Show a success message on the page
  var successMsg = document.getElementById("successMsg");
  successMsg.style.display = "block";

  // Step 5: Clear the form fields
  form.reset();

  // Step 6: Hide the success message after 5 seconds
  setTimeout(function() {
    successMsg.style.display = "none";
  }, 5000);

});
