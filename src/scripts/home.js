// Usa o Proxy para lidar com o estado de autenticação
authProxy.onAuthStateChanged((user) => {
  if (user && user.email === "admin@admin.com") {
    // Exibe o botão de administrador se o usuário for um administrador
    const adminButton = document.getElementById("admin-button");
    if (adminButton) {
      adminButton.style.display = "block";
    }
  } else {
    // Oculta o botão de administrador se o usuário não for um administrador
    const adminButton = document.getElementById("admin-button");
    if (adminButton) {
      adminButton.style.display = "none";
    }
  }

  // Lógica adicional específica da sua página ou componente
  console.log(
    "Estado de autenticação verificado:",
    user ? user.email : "Nenhum usuário autenticado."
  );
});
