import { useRef, useState } from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import "./ImageUpload.css";

const UPLOAD_ENDPOINT = "http://localhost:3001/upload";

/**
 * Componente de UI para upload de imagens.
 * Toda a lógica está no hook useImageUpload; este componente
 * cuida apenas de eventos de DOM e renderização.
 *
 * Props:
 *  - onSuccess(url): callback chamado após upload bem-sucedido
 */
export default function ImageUpload({ onSuccess }) {
  const { preview, error, uploading, uploadedUrl, handleFile, upload, clear } =
    useImageUpload();

  // Controla o estado visual da área de drag-and-drop
  const [dragging, setDragging] = useState(false);

  // Ref para o <input type="file"> oculto — acionado pelo botão estilizado
  const inputRef = useRef(null);

  // Handlers de arquivo

  function handleInputChange(e) {
    handleFile(e.target.files[0]);
    // Reseta o valor para permitir selecionar o mesmo arquivo novamente
    e.target.value = "";
  }

  // Handlers de drag-and-drop

  function handleDragOver(e) {
    e.preventDefault(); // Necessário para permitir o drop
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  }

  // Handler de envio

  async function handleUpload() {
    const url = await upload(UPLOAD_ENDPOINT);
    if (url && onSuccess) {
      onSuccess(url);
    }
  }

  return (
    <div className="upload-wrapper">
      <h2 className="upload-title">Upload de Imagem</h2>

      {/* Zona de drop / seleção */}
      <div
        className={`drop-zone ${dragging ? "drop-zone--active" : ""} ${preview ? "drop-zone--filled" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current.click()}
        role="button"
        aria-label="Clique ou arraste uma imagem"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
      >
        {preview ? (
          /* Preview da imagem selecionada */
          <img
            src={preview}
            alt="Preview"
            className="drop-zone__preview"
          />
        ) : (
          /* Estado vazio */
          <div className="drop-zone__placeholder">
            <span className="drop-zone__icon" aria-hidden="true">🖼️</span>
            <p className="drop-zone__text">
              Arraste uma imagem ou <strong>clique para selecionar</strong>
            </p>
            <p className="drop-zone__hint">JPG, PNG, GIF, WebP · máx. 5MB</p>
          </div>
        )}

        {/* Input real, oculto — acessado via ref */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="drop-zone__input"
          onChange={handleInputChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Mensagem de erro de validação */}
      {error && (
        <p className="upload-error" role="alert">
          ⚠ {error}
        </p>
      )}

      {/* URL retornada pelo servidor após upload */}
      {uploadedUrl && (
        <p className="upload-success" role="status">
          ✔ Upload concluído:{" "}
          <a href={uploadedUrl} target="_blank" rel="noreferrer">
            {uploadedUrl}
          </a>
        </p>
      )}

      {/* Ações */}
      {preview && !uploadedUrl && (
        <div className="upload-actions">
          <button
            className="btn btn--primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Enviando…" : "Enviar imagem"}
          </button>
          <button className="btn btn--secondary" onClick={clear}>
            Remover
          </button>
        </div>
      )}

      {uploadedUrl && (
        <button className="btn btn--secondary" onClick={clear}>
          Enviar outra imagem
        </button>
      )}
    </div>
  );
}
