import { PolicyPage, PSection, PList } from "./PolicyPage";

const PrivacyPolicy = () => (
  <PolicyPage title="Política de Privacidade" updatedAt="abril de 2026">
    <p>
      A Pientro Casa valoriza a sua privacidade e se compromete a proteger os dados pessoais de
      todos os usuários que acessam o site{" "}
      <a href="https://www.pientrocasa.com.br/" className="text-terracotta hover:underline">
        https://www.pientrocasa.com.br/
      </a>
      .
    </p>
    <p>
      Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas
      informações, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
    </p>

    <PSection title="1. Identificação do controlador">
      <p>
        <strong>Razão Social:</strong> Pientro Casa LTDA
        <br />
        <strong>Nome Fantasia:</strong> Pientro Casa
        <br />
        <strong>CNPJ:</strong> 66.790.219/0001-40
        <br />
        <strong>Endereço:</strong> Rua Cuiabá, 3828, Box 01, Neva, Cascavel – PR, CEP 85.802-233
        <br />
        <strong>E-mail para contato:</strong>{" "}
        <a href="mailto:contato@pientrocasa.com.br" className="text-terracotta hover:underline">
          contato@pientrocasa.com.br
        </a>
      </p>
    </PSection>

    <PSection title="2. Dados coletados">
      <p>Coletamos as seguintes informações pessoais:</p>
      <PList items={["Nome completo", "CPF", "Endereço de entrega", "E-mail", "Telefone"]} />
      <p>Além disso, coletamos automaticamente:</p>
      <PList
        items={[
          "Endereço IP",
          "Dados de navegação",
          "Informações sobre dispositivo e navegador",
          "Cookies e identificadores digitais",
        ]}
      />
    </PSection>

    <PSection title="3. Finalidade do uso dos dados">
      <p>Seus dados são utilizados para:</p>
      <PList
        items={[
          "Processar e entregar pedidos",
          "Realizar comunicação sobre compras e suporte",
          "Garantir segurança e prevenção de fraudes",
          "Melhorar a experiência no site",
          "Personalizar anúncios e campanhas de marketing",
          "Cumprir obrigações legais e fiscais",
        ]}
      />
    </PSection>

    <PSection title="4. Compartilhamento de dados">
      <p>Seus dados poderão ser compartilhados com:</p>
      <PList
        items={[
          "Plataformas de pagamento (quando definido)",
          "Empresas de logística e transporte",
          "Parceiros operacionais (estoque, embalagem e atendimento)",
          "Plataformas de análise e marketing",
        ]}
      />
      <p>Isso inclui, mas não se limita a:</p>
      <PList
        items={[
          "ferramentas de análise de dados",
          "plataformas de anúncios digitais",
          "sistemas de gestão e processamento de pedidos",
        ]}
      />
      <p>Todos os parceiros seguem padrões adequados de proteção de dados.</p>
    </PSection>

    <PSection title="5. Cookies e tecnologias de rastreamento">
      <p>Utilizamos cookies para:</p>
      <PList
        items={[
          "Melhorar a navegação",
          "Analisar comportamento no site",
          "Personalizar conteúdo e anúncios",
        ]}
      />
      <p>Ferramentas utilizadas incluem:</p>
      <PList items={["Meta Anúncios (Facebook e Instagram)", "Google Analytics"]} />
      <p>
        Você pode desativar os cookies nas configurações do seu navegador, mas isso pode impactar a
        funcionalidade do site.
      </p>
    </PSection>

    <PSection title="6. Direitos do titular dos dados">
      <p>Nos termos da LGPD, você pode:</p>
      <PList
        items={[
          "Confirmar a existência de tratamento de dados",
          "Acessar seus dados",
          "Corrigir dados incompletos ou desatualizados",
          "Solicitar exclusão de dados (quando aplicável)",
          "Revogar consentimento",
        ]}
      />
      <p>Para exercer seus direitos, entre em contato pelo e-mail informado.</p>
    </PSection>

    <PSection title="7. Segurança dos dados">
      <p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra:</p>
      <PList items={["Acesso não autorizado", "Vazamentos", "Alterações indevidas"]} />
      <p>
        No entanto, nenhum sistema é totalmente seguro e não podemos garantir segurança absoluta.
      </p>
    </PSection>

    <PSection title="8. Retenção de dados">
      <p>Seus dados serão armazenados pelo tempo necessário para:</p>
      <PList items={["Cumprir obrigações legais", "Executar contratos", "Resolver disputas"]} />
    </PSection>

    <PSection title="9. Uso por menores de idade">
      <p>
        Nosso site não é direcionado especificamente a menores de 18 anos, mas pode ser acessado por
        eles.
      </p>
      <p>
        Recomendamos que a navegação e as compras sejam realizadas com supervisão de um responsável
        legal.
      </p>
    </PSection>

    <PSection title="10. Alterações nesta política">
      <p>Esta Política pode ser atualizada a qualquer momento. Recomendamos uma revisão periódica.</p>
    </PSection>

    <PSection title="11. Contato">
      <p>
        Em caso de dúvidas sobre esta Política ou sobre o tratamento de dados, entre em contato:
      </p>
      <p>
        <strong>E-mail:</strong>{" "}
        <a href="mailto:contato@pientrocasa.com.br" className="text-terracotta hover:underline">
          contato@pientrocasa.com.br
        </a>
      </p>
      <p className="italic text-ink/70">
        Ao utilizar este site, você declara estar ciente e de acordo com esta Política de
        Privacidade.
      </p>
    </PSection>
  </PolicyPage>
);

export default PrivacyPolicy;
