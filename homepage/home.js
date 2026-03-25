// ── LOGIN STATE ──────────────────────────────────────────
const user = localStorage.getItem("userName");

if (user) {
  document.getElementById("welcomeUser").innerText = "👋 " + user;
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline";
}

function logout() {
  localStorage.clear();
  location.reload();
}

// ── CART ─────────────────────────────────────────────────
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(name + " added to cart 🚗");
}

// ── TOAST NOTIFICATION ────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── SEARCH ────────────────────────────────────────────────
const searchBox = document.getElementById("searchBox");

if (searchBox) {
  searchBox.addEventListener("keyup", function () {
    const val = this.value.toLowerCase();
    document.querySelectorAll(".car-card").forEach(card => {
      const name = card.querySelector(".car-name").innerText.toLowerCase();
      card.style.display = name.includes(val) ? "block" : "none";
    });
  });
}

// ── HEADER SCROLL TINT ────────────────────────────────────
window.addEventListener("scroll", () => {
  document.querySelector("header").style.background =
    window.scrollY > 60
      ? "rgba(7,9,14,0.97)"
      : "rgba(7,9,14,0.88)";
});
