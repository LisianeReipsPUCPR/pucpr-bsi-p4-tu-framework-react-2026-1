import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch("https://jsonplaceholder.typicode.com/users");
        const dados = await resposta.json();
        setUsuarios(dados);
      } catch (erro) {
        console.log("Erro ao buscar usuários:", erro);
      } finally {
        setLoading(false);
      }
    }

    buscarUsuarios();
  }, []);

  return (
    <div>
      <h1>Usuários (API)</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        usuarios.map((user) => (
          <div key={user.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Cidade: {user.address.city}</p>
          </div>
        ))
      )}
    </div>
  );
}
