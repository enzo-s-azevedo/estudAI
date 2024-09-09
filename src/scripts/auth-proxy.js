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

const isAuthenticated = async () => {
  if (firebase.auth().onAuthStateChanged((user) => user)) return true;
  return false;
};
console.log(isAuthenticated());

// Função para redirecionar para a tela de login se o usuário não estiver autenticado
const redirectIfNotAuthenticated = (redirectTo) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = redirectTo;
    }
  });
};

// Função para redirecionar se o usuário não for admin
const redirectIfNotAdmin = (redirectTo) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      redirectIfNotAuthenticated("/login");
    } else if (user) {
      if (user.email !== "admin@admin.com") {
        window.location.href = redirectTo;
      }
    } else {
      window.location.href = "/pages/admin/";
    }
  });
};
