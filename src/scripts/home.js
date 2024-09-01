firebase.auth().onAuthStateChanged((user) => {
  if (user && user.email === "admin@admin.com") {
    document.getElementById("admin-button").style.display = "block";
  }
});
