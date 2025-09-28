# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planejado
- [ ] API de hotéis completa
- [ ] Sistema de autenticação JWT
- [ ] Cache com Redis
- [ ] Webhooks para notificações
- [ ] API de relatórios

## [1.0.0] - 2025-09-28

### ✨ Adicionado
- **Arquitetura Hexagonal** completa com separação clara de responsabilidades
- **API de Voos** com endpoints para listar, buscar e reservar
- **Sistema de Reservas** com geração automática de PNR
- **Banco de Dados** SQLite com Prisma ORM
- **Validação** robusta com Zod schemas
- **Logging** estruturado com Winston
- **Dockerização** completa com multi-stage builds
- **Documentação** completa da API com exemplos Postman
- **Testes** unitários e de integração com Jest
- **CI/CD** com GitHub Actions
- **Simulação Realista** de APIs externas com latência variável

### 📊 Dados Iniciais
- **9 Voos** pré-cadastrados (6 domésticos, 3 internacionais)
- **7 Hotéis** em Belo Horizonte
- **Preços** realistas baseados em pesquisa de mercado
- **Múltiplas companhias** aéreas (LATAM, Gol, Azul, American, United, Delta)

### 🔧 Funcionalidades Técnicas
- **TypeScript** 5.0+ com tipagem estrita
- **Express.js** com middlewares de segurança
- **CORS** configurado para desenvolvimento local
- **Rate Limiting** para proteção contra abuse
- **Error Handling** centralizado
- **Health Checks** para monitoramento
- **Metrics** básicas de performance

### 📚 Documentação
- README.md completo com guia de instalação
- POSTMAN_EXAMPLES.md com exemplos práticos
- CONTRIBUTING.md com guias para contribuidores
- Coleção Postman importável
- Docker Compose para desenvolvimento local

### 🏗️ Arquitetura
```
src/
├── domain/           # Entidades e regras de negócio
│   ├── entities/     # FlightEntity, HotelEntity, BookingEntity
│   ├── services/     # PriceCalculator, PNRGenerator
│   └── repositories/ # Interfaces dos repositórios
├── application/      # Casos de uso
│   ├── flights/      # ListFlights, BookFlight
│   └── hotels/       # ListHotels
├── infrastructure/   # Implementações
│   ├── database/     # Prisma repositories
│   ├── services/     # API simulators
│   ├── logging/      # Winston logger
│   └── monitoring/   # Metrics
└── presentation/     # Controllers e DTOs
    ├── controllers/  # FlightsController
    ├── routes/       # Express routes
    ├── dto/          # Data Transfer Objects
    └── middlewares/  # Validation, ErrorHandler
```

### 🚀 Deploy
- **Docker** com imagem otimizada
- **Docker Compose** para ambiente completo
- **GitHub Actions** para CI/CD
- **Health checks** integrados

---

## Como usar este changelog

### Tipos de mudanças
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