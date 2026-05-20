// Endereço do endpoint de upload no backend
const UPLOAD_ENDPOINT = "http://localhost:3001/upload";

// Função assíncrona exportada — recebe o arquivo (File) como parâmetro
export async function enviarImagem(file) {

  // FormData é o formato obrigatório para envio de arquivos via HTTP
  const formData = new FormData();

  // Adiciona o arquivo ao FormData com o campo "imagem" — deve bater com o nome esperado pelo Multer no backend
  formData.append("imagem", file);

  // Busca o token JWT salvo no localStorage após o login
  const token = localStorage.getItem("token");

  // Faz a requisição HTTP POST para o backend
  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",

    // Se existir token, envia no cabeçalho Authorization — senão envia cabeçalho vazio
    headers: token ? { Authorization: `Bearer ${token}` } : {},

    // Corpo da requisição — o FormData com o arquivo
    body: formData,
  });

  // Se o servidor retornou erro (status 4xx ou 5xx), response.ok será false
  if (!response.ok) {

    // Tenta ler a mensagem de erro retornada pelo backend — se falhar, usa objeto vazio
    const data = await response.json().catch(() => ({}));

    // Lança um erro com a mensagem do backend ou uma mensagem padrão
    throw new Error(data.erro || "Erro ao enviar imagem.");
  }

  // Se chegou aqui, deu certo — retorna o JSON com a URL da imagem salva
  return response.json();
}