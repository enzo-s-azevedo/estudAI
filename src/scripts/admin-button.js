const adminButton = document.getElementById("admin-button");

isAdmin().then((isAdminUser) => {
  if (isAdminUser) {
    adminButton.style.display = "block"; // Exibe o botão
  } else {
    adminButton.style.display = "none"; // Oculta o botão
  }
});
