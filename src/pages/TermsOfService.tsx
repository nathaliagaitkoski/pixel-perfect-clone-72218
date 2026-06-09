import { PolicyPage, PSection, PList } from "./PolicyPage";

const TermsOfService = () => (
  <PolicyPage title="Termos de Serviço" updatedAt="abril de 2026">
    <p>
      Este documento estabelece os Termos de Serviço que regulam o uso do site{" "}
      <a href="https://www.pientrocasa.com.br/" className="text-terracotta hover:underline">
        https://www.pientrocasa.com.br/
      </a>{" "}
      e a realização de compras na loja Pientro Casa.
    </p>
    <p>Ao acessar este site ou realizar uma compra, você concorda com os termos descritos abaixo.</p>

    <PSection title="1. Identificação">
      <p>
        <strong>Razão Social:</strong> Pientro Casa LTDA
        <br />
        <strong>Nome Fantasia:</strong> Pientro Casa
        <br />
        <strong>CNPJ:</strong> 66.790.219/0001-40
        <br />
        <strong>Endereço:</strong> Rua Cuiabá, 3828, Box 01, Neva, Cascavel – PR, CEP 85.802-233
        <br />
        <strong>E-mail:</strong>{" "}
        <a href="mailto:contato@pientrocasa.com.br" className="text-terracotta hover:underline">
          contato@pientrocasa.com.br
        </a>
      </p>
    </PSection>

    <PSection title="2. Aceitação dos termos">
      <p>
        Ao utilizar o site, o usuário declara que leu, compreendeu e concorda com estes Termos de
        Serviço.
      </p>
    </PSection>

    <PSection title="3. Cadastro do usuário">
      <p>
        Para realizar compras, o cliente deverá fornecer informações verdadeiras, completas e
        atualizadas.
      </p>
      <p>
        A Pientro Casa não se responsabiliza por problemas decorrentes de dados incorretos
        transmitidos pelo usuário, como erros de entrega.
      </p>
    </PSection>

    <PSection title="4. Produtos e disponibilidade">
      <p>
        A Pientro Casa comercializa produtos físicos, com curadoria própria e envio a partir de
        nosso estoque no Brasil.
      </p>
      <p>A disponibilidade dos produtos pode variar sem aviso prévio.</p>
    </PSection>

    <PSection title="5. Prazos de entrega">
      <p>
        Os prazos de entrega são informados no momento da compra e variam conforme a região do
        destinatário e a transportadora escolhida.
      </p>
      <p>
        Os prazos informados são estimativas e podem sofrer variações decorrentes de fatores
        externos, como logística e operação das transportadoras.
      </p>
    </PSection>

    <PSection title="6. Preços e pagamento">
      <p>Os preços dos produtos estão sujeitos a alterações sem aviso prévio.</p>
      <p>
        O pagamento poderá ser processado por plataformas terceirizadas, que possuem seus próprios
        termos e políticas.
      </p>
      <p>A aprovação do pagamento é condição necessária para o envio do pedido.</p>
    </PSection>

    <PSection title="7. Responsabilidades do cliente">
      <p>O cliente é responsável por:</p>
      <PList
        items={[
          "Fornecer informações corretas de entrega",
          "Acompanhar o status do pedido",
          "Estar disponível para retirada da mercadoria",
        ]}
      />
    </PSection>

    <PSection title="8. Limitação de responsabilidade">
      <p>A Pientro Casa não se responsabiliza por:</p>
      <PList
        items={[
          "Atrasos decorrentes de fatores externos",
          "Problemas causados por terceiros (transportadoras, operadores logísticos, etc.)",
          "Informações incorretas fornecidas pelo cliente",
          "Eventos de força maior",
        ]}
      />
    </PSection>

    <PSection title="9. Trocas, devoluções e reembolsos">
      <p>
        As regras de trocas, devoluções e reembolsos estão descritas em documento próprio,
        disponível no site.
      </p>
    </PSection>

    <PSection title="10. Propriedade intelectual">
      <p>
        Todo o conteúdo do site, incluindo imagens, textos, identidade visual e materiais, é de
        propriedade da Pientro Casa e não pode ser reproduzido sem autorização.
      </p>
    </PSection>

    <PSection title="11. Uso indevido">
      <p>É proibido:</p>
      <PList
        items={[
          "Utilização do site para fins ilegais",
          "Realizar fraudes ou tentativas de fraude",
          "Violar sistemas ou segurança do site",
        ]}
      />
    </PSection>

    <PSection title="12. Privacidade">
      <p>
        O tratamento de dados pessoais é regido pela Política de Privacidade disponível no site.
      </p>
    </PSection>

    <PSection title="13. Modificações dos termos">
      <p>
        A Pientro Casa poderá atualizar estes Termos de Serviço a qualquer momento, sendo
        responsabilidade do usuário revisá-los periodicamente.
      </p>
    </PSection>

    <PSection title="14. Legislação aplicável">
      <p>Este contrato é regido pelas leis da República Federativa do Brasil.</p>
    </PSection>

    <PSection title="15. Foro">
      <p>
        Fica eleito o foro da comarca de Cascavel – Paraná para dirimir quaisquer controvérsias
        decorrentes destes Termos de Serviço.
      </p>
      <p className="italic text-ink/70">
        Ao utilizar este site, você concorda com estes Termos de Serviço.
      </p>
    </PSection>
  </PolicyPage>
);

export default TermsOfService;
