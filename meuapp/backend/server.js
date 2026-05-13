const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "segredo_jwt";

const usuarioFake = {
  email: "admin@email.com",
  senha: "123456"
};

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (
    email !== usuarioFake.email ||
    senha !== usuarioFake.senha
  ) {
    return res.status(401).json({
      erro: "Usuário inválido"
    });
  }

    const token = jwt.sign(
    { email },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

app.listen(3001, () => {
  console.log("Servidor rodando");
});

