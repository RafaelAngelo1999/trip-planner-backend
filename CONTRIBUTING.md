# 🤝 Contribuindo para o Trip Planner Backend

Obrigado por considerar contribuir para o Trip Planner Backend! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

Este projeto adere ao [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em cumprir este código.

## 🚀 Como Contribuir

### 1. Reportar Bugs

**Antes de reportar um bug:**

- Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/trip-planner-backend/issues)
- Certifique-se de estar usando a versão mais recente

**Como reportar:**

- Use o template de bug report
- Inclua steps para reproduzir
- Adicione logs e screenshots quando possível
- Especifique versão do Node.js, OS e outras dependências

### 2. Sugerir Melhorias

**Para sugestões de funcionalidades:**

- Abra uma issue com o template de feature request
- Descreva o problema que a funcionalidade resolveria
- Explique como você imagina que deveria funcionar
- Inclua exemplos e casos de uso

### 3. Contribuir com Código

#### Preparação do Ambiente

```bash
# Fork e clone o repositório
git clone https://github.com/seu-usuario/trip-planner-backend.git
cd trip-planner-backend

# Instale dependências
npm install

# Configure o banco de dados
npm run db:generate
npm run db:push
npm run db:seed

# Execute os testes
npm test
```

#### Fluxo de Trabalho

1. **Crie uma branch para sua feature/bugfix:**

   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b bugfix/nome-do-bug
   ```

2. **Faça suas alterações seguindo as convenções:**
   - Siga os padrões de código existentes
   - Escreva testes para novas funcionalidades
   - Mantenha commits pequenos e focados
   - Use mensagens de commit descritivas

3. **Execute testes e linting:**

   ```bash
   npm run test
   npm run lint
   npm run format
   ```

4. **Faça commit das alterações:**

   ```bash
   git add .
   git commit -m "feat: adiciona endpoint para cancelar reservas"
   ```

5. **Faça push e abra um Pull Request:**
   ```bash
   git push origin feature/nome-da-feature
   ```

#### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, lint
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Manutenção, build, etc.

**Exemplos:**

```
feat(flights): adiciona filtro por companhia aérea
fix(booking): corrige validação de data de nascimento
docs(api): atualiza documentação dos endpoints
test(hotels): adiciona testes para busca por cidade
```

## 🏗️ Arquitetura e Padrões

### Estrutura do Projeto

```
src/
├── domain/          # Entidades e regras de negócio
├── application/     # Casos de uso
├── infrastructure/  # Implementações (DB, APIs)
└── presentation/    # Controllers e DTOs
```

### Princípios

- **Arquitetura Hexagonal**: Separação clara de responsabilidades
- **SOLID**: Seguimos os princípios SOLID
- **DRY**: Don't Repeat Yourself
- **Clean Code**: Código limpo e legível

### Padrões de Código

- **TypeScript**: Sempre tipado, sem `any`
- **ESLint + Prettier**: Formatação consistente
- **Jest**: Testes unitários e de integração
- **Zod**: Validação de schemas

## 🧪 Testes

### Executando Testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Escrevendo Testes

- **Unitários**: Para cada caso de uso e entidade
- **Integração**: Para controllers e repositories
- **E2E**: Para fluxos completos da API

**Exemplo de teste:**

```typescript
describe('BookFlightUseCase', () => {
  it('should book a flight successfully', async () => {
    // Arrange
    const mockFlight = FlightEntity.create({...});
    const mockPassenger = PassengerEntity.create({...});

    // Act
    const result = await useCase.execute({...});

    // Assert
    expect(result).toEqual({...});
  });
});
```

## 📚 Documentação

- **README.md**: Informações gerais e setup
- **POSTMAN_EXAMPLES.md**: Exemplos de uso da API
- **JSDoc**: Documente funções complexas
- **Swagger**: Mantenha a documentação da API atualizada

## 🔍 Code Review

### Checklist para Pull Requests

- [ ] Código segue os padrões estabelecidos
- [ ] Testes passam
- [ ] Cobertura de testes mantida/aumentada
- [ ] Documentação atualizada se necessário
- [ ] Não quebra funcionalidades existentes
- [ ] Performance adequada
- [ ] Logs apropriados
- [ ] Tratamento de erros adequado

### O que esperamos em um PR

- **Descrição clara** do que foi alterado
- **Screenshots/GIFs** se aplicável
- **Testes** para as alterações
- **Documentação** atualizada
- **Checklist** preenchido

## 🚀 Release Process

1. **Desenvolver** na branch feature/bugfix
2. **Merge** para `develop` via PR
3. **Testes** automatizados executados
4. **Merge** para `main` quando estável
5. **Tag** de versão criada automaticamente
6. **Deploy** automático para produção

## 📞 Ajuda

**Precisa de ajuda?**

- 💬 Abra uma [Discussion](https://github.com/seu-usuario/trip-planner-backend/discussions)
- 🐛 Reporte bugs nas [Issues](https://github.com/seu-usuario/trip-planner-backend/issues)
- 📧 Entre em contato: [seu-email@exemplo.com]

## 🙏 Reconhecimento

Todos os contribuidores são reconhecidos no README.md e nas release notes.

---

**Obrigado por contribuir! 🎉**
