import { useState, useCallback } from "react";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

/**
 * Hook customizado para gerenciar upload de imagens.
 * Centraliza toda a lógica: validação, preview e estado.
 */
export function useImageUpload() {
  const [preview, setPreview] = useState(null);     // URL temporária para exibir a imagem
  const [file, setFile] = useState(null);           // Arquivo File bruto
  const [error, setError] = useState(null);         // Mensagem de erro de validação
  const [uploading, setUploading] = useState(false);// Indica se está enviando ao servidor
  const [uploadedUrl, setUploadedUrl] = useState(null); // URL final retornada pelo servidor

  /**
   * Valida e prepara o arquivo selecionado.
   * useCallback evita recriar a função a cada render.
   */
  const handleFile = useCallback((selectedFile) => {
    // Limpa estado anterior
    setError(null);
    setUploadedUrl(null);

    if (!selectedFile) return;

    // 1. Valida o tipo MIME do arquivo
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Formato inválido. Use JPG, PNG, GIF ou WebP.");
      return;
    }

    // 2. Valida o tamanho máximo
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError(`Arquivo muito grande. Máximo: ${MAX_SIZE_MB}MB.`);
      return;
    }

    // 3. Cria uma URL de objeto local para exibir o preview imediatamente
    //    sem precisar ir ao servidor ainda.
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setFile(selectedFile);
  }, []);

  /**
   * Envia o arquivo ao backend via FormData (multipart/form-data).
   * Recebe a URL do endpoint como parâmetro para manter o hook reutilizável.
   */
  const upload = useCallback(
    async (endpoint) => {
      if (!file) return;

      // FormData é obrigatório para envio de arquivos binários
      const formData = new FormData();
      formData.append("imagem", file); // "imagem" deve corresponder ao campo esperado no backend

      setUploading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            // NÃO defina Content-Type aqui: o browser define automaticamente
            // com o boundary correto para multipart/form-data
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.erro || "Erro ao enviar imagem.");
        }

        const data = await response.json();
        setUploadedUrl(data.url); // Espera que o backend retorne { url: "..." }
        return data.url;
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    },
    [file]
  );

  /**
   * Limpa todo o estado e libera a URL de objeto da memória.
   * Importante chamar URL.revokeObjectURL para evitar memory leak.
   */
  const clear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setError(null);
    setUploadedUrl(null);
    setUploading(false);
  }, [preview]);

  return { preview, file, error, uploading, uploadedUrl, handleFile, upload, clear };
}
