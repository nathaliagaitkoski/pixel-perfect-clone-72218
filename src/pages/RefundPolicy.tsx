import { PolicyPage, PSection, PList } from "./PolicyPage";

const RefundPolicy = () => (
  <PolicyPage title="Política de Reembolso" updatedAt="abril de 2026">
    <p>
      A Pientro Casa preza pela transparência e pela satisfação de seus clientes. Esta Política de
      Reembolso estabelece as condições para trocas, devoluções e reembolsos realizados através do
      site{" "}
      <a href="https://www.pientrocasa.com.br/" className="text-terracotta hover:underline">
        https://www.pientrocasa.com.br/
      </a>
      .
    </p>

    <PSection title="1. Direito de arrependimento">
      <p>
        Conforme o Código de Defesa do Consumidor, o cliente tem o direito de desistir da compra no
        prazo de até <strong>7 (sete) dias corridos</strong>, contados a partir do recebimento do
        produto.
      </p>
      <p>Para isso:</p>
      <PList
        items={[
          "O produto deve estar sem uso",
          "Deve estar em perfeitas condições",
          "Deve ser devolvido na embalagem original",
        ]}
      />
      <p>
        Nestes casos, a <strong>Pientro Casa arcará com os custos de devolução</strong>.
      </p>
    </PSection>

    <PSection title="2. Produtos com defeito ou avaria">
      <p>Caso o produto apresente defeito ou avaria, o cliente poderá escolher entre:</p>
      <PList
        items={["Reembolso integral", "Troca por outro produto", "Reenvio do mesmo produto"]}
      />
      <p>
        A solicitação deve ser feita em até <strong>7 dias após o recebimento</strong>, acompanhada
        de fotos ou vídeos que comprovem o problema.
      </p>
    </PSection>

    <PSection title="3. Como funciona a devolução">
      <p>
        Todos os produtos da Pientro Casa são físicos e enviados a partir do nosso estoque no
        Brasil. Para devolver um item:
      </p>
      <PList
        items={[
          "Entre em contato pelo e-mail informado abaixo solicitando a devolução",
          "Aguarde o retorno da nossa equipe com as instruções e o endereço para envio",
          "Despache o produto na embalagem original, sem uso e em perfeitas condições",
          "Após o recebimento e conferência, o reembolso ou troca será processado",
        ]}
      />
    </PSection>

    <PSection title="5. Prazo de reembolso">
      <p>Após a aprovação da solicitação:</p>
      <PList
        items={[
          "O reembolso será realizado em até 14 (quatorze) dias úteis",
          "O valor será devolvido pelo mesmo método de pagamento utilizado na compra",
        ]}
      />
    </PSection>

    <PSection title="6. Situações em que não há reembolso">
      <p>Não serão aceitas solicitações de reembolso quando:</p>
      <PList
        items={[
          "O produto apresentar sinais de uso",
          "O produto tiver sido danificado pelo cliente",
          "O pedido foi realizado com informações incorretas (como endereço errado)",
          "Houver fraude, uso indevido ou tentativa de fraude",
        ]}
      />
    </PSection>

    <PSection title="7. Análise das solicitações">
      <p>
        Todas as solicitações passam por análise da equipe da Pientro Casa, podendo ser solicitadas
        evidências adicionais para validação.
      </p>
    </PSection>

    <PSection title="8. Contato">
      <p>Para solicitar trocas, devoluções ou reembolsos:</p>
      <p>
        <strong>E-mail:</strong>{" "}
        <a href="mailto:contato@pientrocasa.com.br" className="text-terracotta hover:underline">
          contato@pientrocasa.com.br
        </a>
      </p>
      <p className="italic text-ink/70">
        Ao realizar uma compra em nosso site, você declara estar ciente e de acordo com esta
        Política de Reembolso.
      </p>
    </PSection>
  </PolicyPage>
);

export default RefundPolicy;
