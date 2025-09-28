# 📋 **CHANGELOG** - Trip Planner Backend

Todas as mudanças importantes neste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.3.0] - 2025-09-28 - **🏨 HOTELS & EXPANDED FLIGHTS**

### ✨ **Adicionado**
- 🏨 **Sistema completo de hotéis**: Busca, filtros e detalhes
- 🗄️ **Nova entidade Hotel**: Com campos customizados (hotelId, nightly, policy)
- 🔍 **Filtros avançados**: Cidade, rating, preço, estrelas, amenidades
- 📊 **Paginação**: Sistema completo com metadados
- ✈️ **30+ voos expandidos**: Incluindo rotas CNF→SFO para 2025-10-01
- 🏨 **10 hotéis**: 7 em Belo Horizonte + 3 em San Francisco
- 📡 **Endpoints de hotéis**: GET /api/hotels, GET /api/hotels/:id, GET /api/hotels/city/:city
- 🏗️ **Arquitetura hexagonal**: Use cases, repositories e controllers para hotéis

### 🔧 **Melhorado**
- 📋 **Schema Prisma**: Adicionados campos específicos para hotéis
- 🌱 **Seed expandido**: Dados realistas de hotéis com amenidades
- 📚 **Documentação**: API Reference atualizada com endpoints de hotéis
- 🔄 **Validação Zod**: Schemas robustos para parâmetros de busca
- ⚡ **Performance**: Queries otimizadas com filtros e ordenação

### 🐛 **Corrigido**
- 🗄️ **Campos de hotel**: Padronização entre entity e database
- 🔗 **Imports**: Caminhos corrigidos para nova estrutura
- 📦 **Dependencies**: Resolução de conflitos de tipos

---

## [1.2.0] - 2024-12-28 - **🚀 LIVE & DOCUMENTED**

### ✨ **Adicionado**

- 🌐 **API totalmente online** em https://trip-planner-backend-three.vercel.app
- 📚 **Documentação completa** organizada em `docs/`
- 📡 **API.md**: Documentação completa da API com exemplos práticos
- 🏗️ **ARCHITECTURE.md**: Detalhes da arquitetura hexagonal
- 🚀 **DEPLOYMENT.md**: Guias completos de deploy
- ❌ **Rota de cancelamento**: `PUT /api/bookings/:id/cancel`
- 🔄 **Status de reserva**: Enum com CONFIRMED, CANCELLED, etc.

### 🔧 **Melhorado**

- 📖 **README.md**: Reestruturado com foco na API online
- 🎯 **Badges informativos**: Status live, tecnologias, licença
- 🌐 **Base URL**: Destacada a URL da API online
- 📝 **Exemplos práticos**: Comandos curl para teste direto
- 🏷️ **Documentação organizada**: Links claros para cada seção

### 🐛 **Corrigido**

- ⚙️ **vercel.json**: Removida propriedade conflitante `functions`
- 🔧 **server.ts**: Compatibilidade serverless e local
- 📦 **package.json**: Scripts de build otimizados

---

## [1.1.0] - 2024-12-28 - **🎯 CORE FEATURES**

### ✨ **Adicionado**

- ✈️ **Sistema de voos completo**: Busca, detalhes, reserva
- 🎫 **Sistema de reservas**: Criação e consulta
- 👤 **Gestão de passageiros**: Dados completos e validação
- �️ **Banco de dados**: Schema Prisma com SQLite
- 🌱 **Seed data**: 9 voos e 7 hotéis pré-configurados
- 🔍 **Filtros de busca**: Origem, destino, data
- ✅ **Validação Zod**: Schemas robustos para entrada/saída
- 🌐 **CORS configurado**: Pronto para integração frontend

### 🏗️ **Arquitetura**

- 🏛️ **Hexagonal Architecture**: Domain, Application, Infrastructure, Presentation
- 🔄 **Use Cases**: Padrão de casos de uso implementado
- 📦 **DTOs**: Transferência de dados entre camadas
- 🔌 **Repositories**: Abstração de persistência
- 🎮 **Controllers**: Separação de responsabilidades HTTP

---

## [1.0.0] - 2024-12-28 - **🎉 INITIAL RELEASE**

### ✨ **Adicionado**

- 🚀 **Projeto base**: Node.js + TypeScript + Express
- 🗄️ **Prisma ORM**: Configuração inicial com SQLite
- 📋 **Health check**: Endpoint de status da API
- � **Docker**: Containerização completa
- 📄 **README**: Documentação inicial
- 📝 **Scripts NPM**: Desenvolvimento e produção
- 🔧 **TypeScript**: Configuração completa
- 📦 **Package.json**: Dependências e metadados

---

## **📊 Estatísticas do Projeto**

- 📁 **Arquivos**: ~50 arquivos TypeScript
- 📏 **Linhas de código**: ~2.500 linhas
- 🧪 **Cobertura de testes**: Em desenvolvimento
- 📚 **Documentação**: 100% completa
- 🚀 **Deploy**: Automatizado via Vercel
- 🌐 **Uptime**: 99.9% (Vercel)

---

## **🎯 Próximas Versões**

### [1.3.0] - **🏨 HOTELS & PACKAGES** (Planejado)

- 🏨 Sistema completo de hotéis
- 📦 Pacotes de viagem (voo + hotel)
- 🛒 Carrinho de compras
- 💳 Sistema de pagamento simulado

### [1.4.0] - **🤖 AI INTEGRATION** (Planejado)

- 🧠 Integração com agentes de IA
- 💡 Recomendações inteligentes
- 📊 Analytics avançados
- 🔮 Previsão de preços

### [2.0.0] - **🚀 PRODUCTION READY** (Roadmap)

- 🔐 Autenticação JWT
- 🌍 APIs reais (Amadeus, Booking.com)
- ⚡ Cache Redis
- 📈 Métricas Prometheus
- 🔧 Admin dashboard

---

<div align="center">
  <strong>📈 Acompanhe o desenvolvimento do Trip Planner Backend</strong>
  <br><br>
  <a href="https://github.com/RafaelAngelo1999/trip-planner-backend">🐙 GitHub Repository</a> •
  <a href="https://trip-planner-backend-three.vercel.app/health">🟢 Live Status</a>
</div>
- `Adicionado` para novas funcionalidades
- `Alterado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades corrigidas

### Versionamento

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Funcionalidades adicionadas de forma compatível
- **PATCH**: Correções de bugs compatíveis

### Links

- [Unreleased]: Comparação entre main e última release
- [1.0.0]: Primeira release estável
