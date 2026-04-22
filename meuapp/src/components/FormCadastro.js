import { useState } from "react";
import { cadastrarUsuario } from "../services/cadastroService";

function FormCadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    idade: "",
    genero: "",
    aceiteTermos: false,
  });

  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);


  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await cadastrarUsuario(formData);
      setEnviado(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }

  }

  function handleReset() {
    setFormData({
      nome: "",
      email: "",
      idade: "",
      genero: "",
      aceiteTermos: false,
    });
    setEnviado(false);

    setErro("");

  }

  if (enviado) {
    return (
      <div>
        <h2>Cadastro realizado!</h2>
        <p>Olá, {formData.nome}! Seu e-mail {formData.email} foi registrado.</p>
        <button onClick={handleReset}>Novo cadastro</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Formulário de Cadastro</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <form onSubmit={handleSubmit}>

        {/* Input de texto */}
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
          />
        </div>

        {/* Input de e-mail */}
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
          />
        </div>

        {/* Input numérico */}
        <div>
          <label htmlFor="idade">Idade:</label>
          <input
            type="number"
            id="idade"
            name="idade"
            value={formData.idade}
            onChange={handleChange}
            min="1"
            max="120"
          />
        </div>

        {/* Select */}
        <div>
          <label htmlFor="genero">Gênero:</label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="nao-informar">Prefiro não informar</option>
          </select>
        </div>

        {/* Checkbox */}
        <div>
          <input
            type="checkbox"
            id="aceiteTermos"
            name="aceiteTermos"
            checked={formData.aceiteTermos}
            onChange={handleChange}
          />
          <label htmlFor="aceiteTermos">Aceito os termos de uso</label>
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Cadastrar"}
        </button>


      </form>

      {/* Visualização em tempo real do estado */}
      <div>
        <h3>Estado atual do formulário (para fins didáticos):</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default FormCadastro;