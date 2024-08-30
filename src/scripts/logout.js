function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../tela_login";
    })
    .catch(() => alert("Erro ao sair"));
}
