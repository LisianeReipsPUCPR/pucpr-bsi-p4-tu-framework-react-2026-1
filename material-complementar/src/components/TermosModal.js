import { useState } from "react";
import "./TermosModal.css";

// Texto completo do termo — edite conforme necessário
const TEXTO_COMPLETO = `
Termo de Aceite e Política de Uso

1. Aceitação dos Termos
Ao utilizar este serviço, você concorda com todos os termos e condições descritos neste documento. Caso não concorde com alguma das disposições, recomendamos que não prossiga com o cadastro.

2. Coleta de Dados
Os dados informados (nome, e-mail, idade e gênero) serão utilizados exclusivamente para fins de identificação e personalização do serviço. Não compartilhamos suas informações pessoais com terceiros sem o seu consentimento expresso, exceto quando exigido por lei.

3. Uso Responsável
O usuário se compromete a fornecer informações verdadeiras e atualizadas, sendo responsável por qualquer dano causado pelo fornecimento de dados incorretos ou fraudulentos.

4. Privacidade e Segurança
Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. Os dados são armazenados em servidores seguros e com acesso restrito.

5. Alterações nos Termos
Reservamo-nos o direito de alterar este termo a qualquer momento. Em caso de mudanças relevantes, o usuário será notificado por e-mail ou por aviso na plataforma.

6. Contato
Em caso de dúvidas sobre este termo, entre em contato pelo e-mail: contato@meuapp.com.br

Última atualização: abril de 2026.
`.trim();

// Quantos caracteres mostrar no preview antes do "...Leia mais"
const PREVIEW_CHARS = 180;

function TermosModal({ onFechar }) {
  const [expandido, setExpandido] = useState(false);

  // Fecha ao clicar no overlay (fora do modal)
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onFechar();
    }
  }

  return (
    <div className="termos-overlay" onClick={handleOverlayClick}>
      <div className="termos-modal" role="dialog" aria-modal="true" aria-labelledby="termos-titulo">

        {/* Cabeçalho */}
        <div className="termos-modal__header">
          <h2 className="termos-modal__titulo" id="termos-titulo">
            Termos de Uso
          </h2>
          <button className="termos-modal__fechar" onClick={onFechar} aria-label="Fechar">
            &times;
          </button>
        </div>

        {/* Corpo */}
        <div className="termos-modal__corpo">
          {!expandido ? (
            // Estado recolhido: preview + botão "Leia mais"
            <p>
              {TEXTO_COMPLETO.slice(0, PREVIEW_CHARS)}...{" "}
              <button
                className="termos-leia-mais"
                onClick={() => setExpandido(true)}
              >
                Leia mais
              </button>
            </p>
          ) : (
            // Estado expandido: texto completo com quebras de parágrafo
            <>
              {TEXTO_COMPLETO.split("\n\n").map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
              <button
                className="termos-leia-mais"
                onClick={() => setExpandido(false)}
              >
                Recolher
              </button>
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="termos-modal__rodape">
          <button className="termos-modal__btn-ok" onClick={onFechar}>
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}

export default TermosModal;
