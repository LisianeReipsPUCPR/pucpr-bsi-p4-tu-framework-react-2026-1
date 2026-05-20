import ImageUpload from "../components/ImageUpload";

/**
 * Página que hospeda o componente de upload.
 * Mantém a responsabilidade da rota separada da lógica de upload.
 */
export default function UploadPage() {
  function handleUploadSuccess(url) {
    console.log("Imagem disponível em:", url);
    // Aqui você pode: salvar no contexto global, redirecionar, exibir notificação, etc.
  }

  return (
    <main>
      <ImageUpload onSuccess={handleUploadSuccess} />
    </main>
  );
}
