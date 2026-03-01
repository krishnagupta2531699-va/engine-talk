function browse(){
    alert("Browse Cars Section");
}
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