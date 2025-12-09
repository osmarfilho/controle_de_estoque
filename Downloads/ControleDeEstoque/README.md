📦 Sistema de Controle de Estoque - Web II
Equipe
Osmar Filho
Histon Chamberlay
João Filho

Descrição
O Sistema de Controle de Estoque é uma aplicação Fullstack desenvolvida para resolver o problema de gerenciamento de inventário e organização de produtos em múltiplos locais (depósitos, unidades, filiais). Permite aos usuários criar múltiplos "Locais de Estoque" (Locations) para categorizar e isolar seus produtos, mantendo o controle detalhado de preço, quantidade e categoria de cada item. O foco principal é oferecer uma experiência de usuário (UX) fluida, moderna e visualmente agradável, ideal para pequenas e médias empresas.

⚙️ Tecnologias
Next.js 14+ (App Router): Framework principal utilizando a arquitetura moderna de Server/Client Components.

MongoDB Atlas & Mongoose: Banco de dados NoSQL na nuvem para persistência de dados flexível.

HeroUI (NextUI) & Tailwind CSS: Biblioteca de componentes e utilitários CSS para uma interface responsiva e premium.

NextAuth.js: Sistema de autenticação seguro (Credenciais).

🎯 Funcionalidades Atuais
As funcionalidades e o backend foram completamente focados em inventário e estoque:

[x] Cadastro e Login de Usuários: Sistema completo de autenticação com proteção de rotas.

[x] Múltiplos Locais de Estoque: Criação, visualização e seleção de diferentes Depósitos ou Unidades (CRUD de Locais de Estoque). O modelo de usuário (User.ts) foi atualizado para usar os campos locations e activeLocation.

[x] Gestão de Produtos (CRUD Completo): Adicionar, editar, listar e excluir produtos através de APIs (/api/products e /api/products/[id]) que manipulam os campos Preço, Quantidade, Categoria e Localização.

[x] Controle de Inventário: Visualização de produtos organizados por categoria ou localização.

[ ] Alerta de Estoque Baixo: (Próxima funcionalidade) Feedback visual para quantidades críticas.

[x] Interface Responsiva: Design adaptado para Celulares e Desktop.

[x] Soft UI Design: Estética minimalista com feedbacks visuais e micro-interações.

🛠️ Configuração
Instruções para rodar o projeto localmente:

Clone o repositório

Bash

git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SistemaDeControleDeEstoque
Configure as Variáveis de Ambiente Crie um arquivo .env.local na raiz e adicione as chaves de conexão e segurança:

Snippet de código

MONGODB_URI=sua_string_de_conexao_mongodb_atlas
NEXTAUTH_SECRET=um_segredo_aleatorio_seguro
NEXTAUTH_URL=http://localhost:3000
Instale as dependências

Bash

npm install
Rode o projeto

Bash

npm run dev
Acesse http://localhost:3000