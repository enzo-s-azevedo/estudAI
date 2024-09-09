describe("Verificar se o site está rodando", () => {
  test("GET / should return 200", async () => {
    const res = await fetch("http://localhost:3000");
    expect(res.status).toBe(200);
  });
});

// jest.mock("firebase/auth");

// describe("Teste de login", () => {
//   beforeEach(() => {
//     document.body.innerHTML = `
//       <input type="text" id="email" />
//       <input type="password" id="password" />
//       <button id="login-button">Login</button>
//     `;
//   });

//   test("Deve redirecionar para a página inicial se o login for bem-sucedido", async () => {
//     // Mock da função de autenticação do Firebase
//     firebase.auth().signInWithEmailAndPassword.mockResolvedValue({});

//     form.email().value = "teste@example.com";
//     form.password().value = "senha123";

//     await login(); // Chama a função de login

//     expect(window.location.href).toBe("../tela_inicial"); // Verifica se o redirecionamento ocorreu
//   });

//   test("Deve exibir erro se o login falhar", async () => {
//     // Mock de um erro de autenticação do Firebase
//     firebase.auth().signInWithEmailAndPassword.mockRejectedValue({
//       code: "auth/user-not-found",
//     });

//     form.email().value = "emailinvalido@example.com";
//     form.password().value = "senhaerrada";

//     await login();

//     expect(alert).toHaveBeenCalledWith("Usuário não encontrado"); // Verifica se a mensagem de erro é exibida
//   });
// });
