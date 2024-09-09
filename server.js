const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use("/src", express.static(path.join(__dirname, "/src")));
app.use("/styles", express.static(path.join(__dirname, "/src/styles")));
app.use("/scripts", express.static(path.join(__dirname, "/src/scripts")));

app.get("/", (req, res) => {
  res.sendFile("/src/pages/tela_inicial/index.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  res.sendFile("/src/pages/tela_login/index.html", { root: __dirname });
});

app.get("/entrar", (req, res) => {
  res.redirect("/login");
});

app.get("/cadastro", (req, res) => {
  res.sendFile("/src/pages/tela_cadastro/index.html", { root: __dirname });
});

app.get("/admin", (req, res) => {
  res.sendFile("/src/pages/admin/index.html", { root: __dirname });
});

app.get("/admin/cadastro-materiais", (req, res) => {
  res.sendFile("/src/pages/tela_cadastro_materiais/index.html", {
    root: __dirname,
  });
});

app.get("/cronometro", (req, res) => {
  res.sendFile("/src/pages/tela_cronometro/index.html", { root: __dirname });
});

app.get("/admin/gerenciar-materiais", (req, res) => {
  res.sendFile("/src/pages/tela_gerenciar_materiais/index.html", {
    root: __dirname,
  });
});

app.get("/materiais", (req, res) => {
  res.sendFile("/src/pages/tela_materiais/index.html", { root: __dirname });
});

app.get("/minha-biblioteca", (req, res) => {
  res.sendFile("/src/pages/tela_minha_biblioteca/index.html", {
    root: __dirname,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
