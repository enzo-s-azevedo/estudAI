const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("src"));

app.get("/login", (req, res) => {
  res.send("Esta é uma tela de login");
});

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
