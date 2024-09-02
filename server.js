const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Define the directory where the HTML file is located
const htmlDirectoryPath = path.join(__dirname, "/src/pages/tela_inicial");

// Define the directory where the styles are located
const stylesDirectoryPath = path.join(__dirname, "/src/styles");

const scriptsDirectoryPath = path.join(__dirname, "/src/scripts");

// Serve the HTML file

app.use("/", express.static(htmlDirectoryPath));
app.use("/pages/tela_inicial", express.static(htmlDirectoryPath));
app.use(
  "/pages/tela_login",
  express.static(path.join(__dirname, "/src/pages/tela_login"))
);
app.use(
  "/pages/tela_cadastro",
  express.static(path.join(__dirname, "/src/pages/tela_cadastro"))
);
app.use(
  "/pages/admin",
  express.static(path.join(__dirname, "/src/pages/admin"))
);
app.use(
  "/pages/tela_cadastro_materiais",
  express.static(path.join(__dirname, "/src/pages/tela_cadastro_materiais"))
);
app.use(
  "/pages/tela_cronometro",
  express.static(path.join(__dirname, "/src/pages/tela_cronometro"))
);
app.use(
  "/pages/tela_gerenciar_materiais",
  express.static(path.join(__dirname, "/src/pages/tela_gerenciar_materiais"))
);
app.use(
  "/pages/tela_materiais",
  express.static(path.join(__dirname, "/src/pages/tela_materiais"))
);
app.use(
  "/pages/tela_minha_biblioteca",
  express.static(path.join(__dirname, "/src/pages/tela_minha_biblioteca"))
);

// Serve the styles
app.use("/styles", express.static(stylesDirectoryPath));

app.use("/scripts", express.static(scriptsDirectoryPath));

app.use("/tests", express.static(path.join(__dirname, "/src/tests")));

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
