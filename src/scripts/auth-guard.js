firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "../../pages/tela_login";
  } else if (user.email !== "admin@admin.com") {
    const restrictedPages = [
      "admin",
      "tela_cadastro_materiais",
      "tela_gerenciar_materiais",
    ];
    const currentPath = window.location.pathname.split("/");
    currentPath.pop();
    currentPath.shift();

    restrictedPages.forEach((page) => {
      if (currentPath.includes(page)) {
        window.location.href = "../../pages/tela_inicial";
      }
    });
  }
});
