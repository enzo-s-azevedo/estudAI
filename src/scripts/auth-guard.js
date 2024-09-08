// Cria um Proxy para interceptar o método onAuthStateChanged do Firebase
const authProxy = new Proxy(firebase.auth(), {
  get: function (target, prop) {
    if (prop === "onAuthStateChanged") {
      // Retorna uma função modificada para interceptar o comportamento padrão
      return function (callback) {
        target.onAuthStateChanged((user) => {
          if (!user) {
            // Se o usuário não estiver autenticado, redireciona para a tela de login
            window.location.href = "../../pages/tela_login";
          } else if (user.email !== "admin@admin.com") {
            // Se o usuário não é admin, restringe o acesso a determinadas páginas
            const restrictedPages = [
              "admin",
              "tela_cadastro_materiais",
              "tela_gerenciar_materiais",
            ];
            const currentPath = window.location.pathname.split("/");
            currentPath.pop();
            currentPath.shift();

            // Redireciona para a página inicial se o usuário tentar acessar páginas restritas
            restrictedPages.forEach((page) => {
              if (currentPath.includes(page)) {
                window.location.href = "../../pages/tela_inicial";
              }
            });
          }

          // Executa o callback fornecido pelo usuário
          callback(user);
        });
      };
    }
    // Para outras propriedades, retorna o comportamento original
    return target[prop];
  },
});

authProxy();

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

firebase.auth().onAuthStateChanged((user) => {});
