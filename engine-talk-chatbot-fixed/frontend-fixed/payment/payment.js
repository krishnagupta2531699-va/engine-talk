


document.querySelector("#cardNumber").addEventListener("input", function () {
  var raw = this.value.replace(/\D/g, "");          // remove non-digits
  var formatted = raw.replace(/(.{4})/g, "$1 ").trim(); // add space every 4 digits
  this.value = formatted;
  document.querySelector("#cardDisplay").innerText = formatted || "•••• •••• •••• ••••";
});

document.querySelector("#cardHolder").addEventListener("input", function () {
  document.querySelector("#holderDisplay").innerText = this.value.toUpperCase() || "YOUR NAME";
});
document.querySelector("#expiry").addEventListener("input", function () {
  var val = this.value.replace(/\D/g, "");           // digits only
  if (val.length >= 3) val = val.slice(0,2) + "/" + val.slice(2); // add slash
  this.value = val;
  document.querySelector("#expiryDisplay").innerText = val || "MM/YY";
});

// CVV → only numbers
document.querySelector("#cvv").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});


function processPayment() {

  var cardNumber = document.querySelector("#cardNumber").value.replace(/\s/g, "");
  var cardHolder = document.querySelector("#cardHolder").value.trim();
  var expiry     = document.querySelector("#expiry").value.trim();
  var cvv        = document.querySelector("#cvv").value.trim();
  var message    = document.querySelector("#payMessage");

  // Basic validation checks
  if (cardNumber.length < 16) {
    message.style.color = "#ff3c5a";
    message.innerText = "Please enter a valid 16-digit card number.";
    return;
  }

  if (cardHolder === "") {
    message.style.color = "#ff3c5a";
    message.innerText = "Please enter the card holder name.";
    return;
  }

  if (expiry.length < 5) {
    message.style.color = "#ff3c5a";
    message.innerText = "Please enter a valid expiry date (MM/YY).";
    return;
  }

  if (cvv.length < 3) {
    message.style.color = "#ff3c5a";
    message.innerText = "Please enter a valid 3-digit CVV.";
    return;
  }

  // All good — disable button and show success
  document.querySelector("#payBtn").disabled = true;
  message.innerText = "";

  showSuccess();
}


// ── STEP 3: Show success overlay and redirect ──

function showSuccess() {

  // Show the overlay
  document.querySelector("#successOverlay").classList.add("show");

  // Countdown from 3 to 0, then go home
  var count = 3;

  var timer = setInterval(function () {
    count = count - 1;
    document.querySelector("#countdown").innerText = count;

    if (count === 0) {
      clearInterval(timer);
      window.location.href = "../home page/home.html"; // ← redirect to home
    }
  }, 1000);
}
