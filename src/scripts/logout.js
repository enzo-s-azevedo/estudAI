function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../../pages/tela_login";
    })
    .catch(() => alert("Erro ao sair"));
}
