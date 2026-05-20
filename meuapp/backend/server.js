const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "segredo_jwt";

// ── Configuração do Multer ──  

// diskStorage salva o arquivo no disco com nome único.
// Alternativa: memoryStorage() para guardar em buffer e enviar a um serviço de nuvem.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // pasta local — crie-a ou o Multer lança erro
  },
  filename: (req, file, cb) => {
    // Ex.: "1716041234567-imagem.png"
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Filtro: rejeita arquivos que não sejam imagem no próprio backend
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagem inválido."), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Middleware de autenticação JWT (reutilizado)

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: "Token ausente." });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido." });
  }
}

// Rota de upload de imagem, protegida por JWT e processada pelo Multer.

// "uploads/" servido como arquivos estáticos para o frontend acessar a URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// upload.single("imagem"): processa o campo "imagem" do FormData
app.post(
  "/upload",
  authMiddleware,            // exige JWT válido
  upload.single("imagem"),  // nome deve bater com formData.append("imagem", file)
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ erro: "Nenhum arquivo recebido." });
    }

    // Monta URL pública para o frontend exibir a imagem
    const url = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ url });
  }
);

// Tratamento de erros do Multer (tamanho, tipo)
app.use((err, req, res, _next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ erro: err.message });
  }
  res.status(500).json({ erro: "Erro interno." });
});

// Rota de login (igual à original)

const usuarioFake = { email: "admin@email.com", senha: "123456" };

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  if (email !== usuarioFake.email || senha !== usuarioFake.senha) {
    return res.status(401).json({ erro: "Usuário inválido" });
  }
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
