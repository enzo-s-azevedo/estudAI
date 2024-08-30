firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "../../pages/tela_login";
  }
});
