# CondoSync – Sistema de Gestão de Condomínios

O CondoSync é uma plataforma digital desenvolvida para centralizar e automatizar os processos administrativos de condomínios residenciais, melhorando a comunicação entre moradores, funcionários e administradores.

---

## Tecnologias Utilizadas

- **Frontend:** React + Vite
- **Backend:** .NET 8 (C#)
- **Banco de Dados:** PostgreSQL via Supabase
- **Cache:** Redis
- **Mensageria:** RabbitMQ
- **Containerização:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

---

## Funcionalidades Implementadas

- Autenticação com JWT e controle de acesso por perfil (Administrador, Funcionário, Morador)
- Cadastro e gestão de moradores e funcionários
- Publicação e listagem de avisos
- Registro e acompanhamento de encomendas
- Registro e acompanhamento de reclamações
- Reserva de áreas comuns com controle de conflito de horário
- Log de auditoria de ações no sistema
- Cache com Redis e filas com RabbitMQ

---

## Pré-requisitos

Antes de rodar o projeto, instale:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (com WSL 2 habilitado no Windows)
- [Git](https://git-scm.com/)

---

## Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/Jotagamaral/Projeto_residencial.git
cd Projeto_residencial
```

### 2. Configure as variáveis de ambiente

```bash
cd docker
cp .env.example .env
```

### 3. Suba os containers

```bash
docker compose up --build
```

Aguarde o build completo. Na primeira execução pode demorar alguns minutos.

### 4. Acesse o sistema

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend (API) | http://localhost:8080 |
| RabbitMQ (painel) | http://localhost:15672 |

---

## Como Executar Apenas o Frontend

Caso queira rodar somente o frontend sem Docker:

### Pré-requisito

- [Node.js LTS](https://nodejs.org/)

### Passos

```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## Como Executar os Testes

```bash
cd backend.Tests
dotnet test
```

---

## Estrutura do Projeto

```
Projeto_residencial/
├── backend/          # API em .NET (C#)
├── backend.Tests/    # Testes unitários do backend
├── frontend/         # Interface em React + Vite
├── DB/supabase/      # Migrations e scripts SQL
├── docker/           # Docker Compose e variáveis de ambiente
├── docs/             # Documentação do projeto
└── scripts/          # Scripts auxiliares (seed do banco)
```

---

## Perfis de Usuário

| Perfil | Permissões |
|---|---|
| Administrador / Síndico | Gerencia moradores, funcionários, avisos e reclamações |
| Funcionário / Portaria | Registra encomendas e controla visitantes |
| Morador | Realiza reservas, registra reclamações e acompanha avisos |

---

## Equipe

| Matrícula | Nome |
|---|---|
| 22250399 | Daví Alves Cardoso |
| 22309466 | João Gabriel |
| 22250409 | Henrique Rocha |
| 22252016 | Thales Martins |
| 22407619 | Gabriel Jesus |

**Orientador:** Prof. Thiago Leite  
**Instituição:** Centro Universitário de Brasília – UniCEUB  
**Curso:** Ciência da Computação – 2026
