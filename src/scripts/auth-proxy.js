// Função para verificar se o usuário é admin
const isAdmin = async () => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Comparando o email do usuário com "admin@admin.com"
        resolve(user.email === "admin@admin.com");
      } else {
        resolve(false);
      }
    });
  });
};

// Função para redirecionar se o usuário não for admin
const redirectIfNotAdmin = (redirectTo) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (user.email !== "admin@admin.com") {
        window.location.href = redirectTo;
      }
    } else {
      window.location.href = "/pages/admin/";
    }
  });
};
