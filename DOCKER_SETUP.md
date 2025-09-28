# 🐳 Configuração Docker no GitHub

Este documento explica como configurar Docker Hub com GitHub Actions quando você estiver pronto.

## 📋 Pré-requisitos

1. **Conta no Docker Hub**
   - Criar conta gratuita em: https://hub.docker.com/
   - Confirmar email

2. **Personal Access Token**
   - No Docker Hub: Account Settings → Security → New Access Token
   - Nome: `github-actions-tripplanner`
   - Copiar o token (só aparece uma vez!)

## ⚙️ Configuração no GitHub

### 1. Adicionar Secrets no Repositório

1. Ir para seu repositório no GitHub
2. Settings → Secrets and variables → Actions
3. Click em "New repository secret"

**Adicionar estes 2 secrets:**

```
Nome: DOCKER_USERNAME
Valor: seu-usuario-dockerhub

Nome: DOCKER_PASSWORD  
Valor: seu-personal-access-token
```

### 2. Atualizar Pipeline (quando pronto)

No arquivo `.github/workflows/ci-cd.yml`, adicionar este job:

```yaml
publish-docker:
  name: 🐳 Build & Publish Docker
  runs-on: ubuntu-latest
  needs: test-and-build
  if: github.ref == 'refs/heads/main'
  
  steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🐳 Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: 🔐 Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: 🚀 Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          ${{ secrets.DOCKER_USERNAME }}/trip-planner-backend:latest
          ${{ secrets.DOCKER_USERNAME }}/trip-planner-backend:${{ github.sha }}
```

## 🧪 Testando Localmente

Antes de configurar no GitHub, teste localmente:

```bash
# Build da imagem
docker build -t trip-planner-backend .

# Executar container
docker run -p 3001:3001 trip-planner-backend

# Testar API
curl http://localhost:3001/health
```

## 📦 Alternativas ao Docker Hub

Se não quiser usar Docker Hub, outras opções:

1. **GitHub Container Registry (GHCR)**
   - Gratuito para repositórios públicos
   - Integrado ao GitHub
   - URL: `ghcr.io/seu-usuario/trip-planner-backend`

2. **Amazon ECR**
   - Para deployments na AWS
   - Pago, mas integrado com AWS

3. **Google Container Registry**
   - Para deployments no Google Cloud
   - Pago, mas integrado com GCP

## 🔄 Exemplo com GitHub Container Registry

Para usar GHCR em vez do Docker Hub:

```yaml
- name: 🔐 Login to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: 🚀 Build and push to GitHub Container Registry
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: |
      ghcr.io/${{ github.repository }}:latest
      ghcr.io/${{ github.repository }}:${{ github.sha }}
```

## ✅ Status Atual

**✅ Funcionando sem Docker:**
- Pipeline roda testes, build e validações
- Todos os checks passam
- Pronto para desenvolvimento

**🔄 Para configurar Docker (opcional):**
1. Criar conta Docker Hub
2. Gerar Personal Access Token
3. Adicionar secrets no GitHub
4. Atualizar pipeline

**Não é necessário configurar Docker agora!** O projeto está completamente funcional sem ele.