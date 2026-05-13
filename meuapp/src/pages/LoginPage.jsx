import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function fazerLogin() {
  try {

    const resposta = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha
      })
    });

    const dados = await resposta.json();

    console.log(dados);

    // LOGIN INVÁLIDO
    if (!resposta.ok) {

      alert(dados.erro);

      localStorage.removeItem("token");

      return;
    }

    // LOGIN VÁLIDO
    localStorage.setItem("token", dados.token);

    navigate("/usuarios");

  } catch (erro) {

    console.log(erro);

  }
}

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={fazerLogin}>
        Entrar
      </button>
    </div>
  );
}


