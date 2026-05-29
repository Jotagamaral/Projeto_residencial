# CondoSync - Arquitetura, Tecnologias e Estado Atual

Este documento consolida a análise técnica e o entendimento detalhado do ecossistema **CondoSync**, mapeando as tecnologias, padrões arquiteturais adotados, estrutura de dados e o estado atual do desenvolvimento.

---

## 1. Objetivo do Projeto

O **CondoSync** é uma plataforma digital desenvolvida para centralizar e automatizar os processos administrativos de condomínios residenciais. O objetivo é unificar e aprimorar a comunicação e a rastreabilidade operacional entre três perfis principais:
*   **Moradores:** Consulta de avisos, registro de reclamações e reserva de áreas comuns.
*   **Funcionários (Portaria):** Registro de recebimento e retirada de encomendas, além de controle de acesso de visitantes.
*   **Administrador / Síndico:** Gestão integral de moradores, funcionários, locais de uso comum, informativos gerais e moderação de conflitos/reclamações.

---

## 2. Tecnologias Utilizadas

O ecossistema é projetado sobre uma stack moderna, visando isolamento de responsabilidades, alta disponibilidade e degradação suave.

### Backend
*   **Plataforma principal:** .NET 8 (C#) rodando em ambiente multiplataforma.
*   **Acesso a Dados:** Entity Framework Core (EF Core) com o provedor `Npgsql` para PostgreSQL.
*   **Cache:** Redis (via driver `StackExchange.Redis`) atuando como cache de segundo nível (L2).
*   **Mensageria:** RabbitMQ (via biblioteca cliente nativa) utilizado para o processamento assíncrono de logs de auditoria.
*   **Documentação da API:** Swagger/OpenAPI configurado para exigir autorização com tokens JWT.
*   **Carregamento de Configurações:** dotenv.net para leitura do arquivo `.env` tanto no Docker quanto em execução manual.

### Frontend
*   **Estrutura Base:** React 19 executado sob o empacotador rápido Vite.
*   **Estilização:** Tailwind CSS v4.1.11 integrado de forma nativa ao Vite para design responsivo.
*   **Roteamento:** React Router DOM (v7) gerenciando fluxos de navegação pública e autenticada.
*   **Consumo de API:** Axios para requisições assíncronas HTTP integradas aos serviços.
*   **Ícones:** React Icons fornecendo suporte visual aos menus e ações.

### Banco de Dados & Infraestrutura
*   **Banco de Dados:** PostgreSQL hospedado/gerenciado via Supabase.
*   **Gestão de Migrações:** Scripts estruturados SQL armazenados no diretório `DB/supabase/migrations`.
*   **Containerização:** Docker e Docker Compose, contendo imagens otimizadas para a API (.NET), Web (Vite), banco Redis e servidor RabbitMQ.
*   **Automação e Qualidade:**
    *   **Husky & Commitlint:** Padronização de mensagens de commit baseada no Conventional Commits.
    *   **Semantic Release:** Controle automático de versão (`package.json`, `package-lock.json`, `CHANGELOG.md`) baseado nos commits enviados à branch principal.

---

## 3. Padrões Arquiteturais e Fluxos de Dados

O projeto implementa uma arquitetura monolítica modular e altamente desacoplada no backend, baseada em camadas bem definidas.

```
+--------------------------------------------------------+
|                 Frontend (React SPA)                   |
+---------------------------+----------------------------+
                            | HTTP / JWT
                            v
+--------------------------------------------------------+
|            Controllers (ASP.NET Core API)              |
+-------------+----------------------------+-------------+
              |                            | Intercepta
              v                            v
+----------------------------+   +-----------------------+
|  Services (Negócio/Regras) |   | AuditLogActionFilter  |
+-------------+--------------+   +-----------+-----------+
              |                              |
              | Cache L1/L2                  | Despacho Assíncrono
              v                              v
+----------------------------+   +-----------------------+
|    Cache (Redis/InMemory)  |   | RabbitMQ (audit_logs) |
+-------------+--------------+   +-----------+-----------+
              |                              |
              | Acesso Direto                | Consumo Assíncrono
              v                              v
+----------------------------+   +-----------------------+
|        Repositories        |   |  Worker (LogWorker)   |
+-------------+--------------+   +-----------+-----------+
              |                              |
              | EF Core                      | EF Core
              v                              v
+--------------------------------------------------------+
|                 PostgreSQL (Supabase)                  |
+--------------------------------------------------------+
```

### Camadas do Backend (`backend/src`)
1.  **Controllers:** Expõem os endpoints REST, recebem requisições HTTP, executam validações preliminares de payload e retornam respostas DTO formatadas.
2.  **Services:** Contêm a lógica de negócio principal do sistema (como verificação de disponibilidade em reservas e controle de fluxos de status de encomendas).
3.  **Repositories:** Realizam a comunicação direta com o banco de dados por meio do `AppDbContext`, abstraindo comandos SQL e operações do ORM.
4.  **Models:** Representam as entidades de domínio mapeadas diretamente para as tabelas do PostgreSQL.
5.  **DTOs:** Objetos de transferência de dados específicos para requisições (Inputs) e respostas (Outputs), evitando a exposição direta das entidades de banco.

### Sistema de Auditoria Assíncrona
Uma das arquiteturas mais refinadas do projeto é o sistema de auditoria não bloqueante:
1.  **Interceptação Global:** O `AuditLogActionFilter` intercepta cada execução de controller de forma global. Por meio de reflexão, ele identifica quem executou o comando (extraído do Token JWT), qual entidade foi afetada, qual a ação realizada (criação, edição, exclusão) e o método HTTP.
2.  **Envio para Fila:** Os detalhes do log são empacotados e despachados assinamente para a fila `audit_logs` do RabbitMQ usando o `RabbitMQService`.
3.  **Consumo Assíncrono:** O `LogWorker`, implementado como um `BackgroundService` em segundo plano do ASP.NET Core, consome as mensagens da fila e persiste cada registro de auditoria na tabela `Logs` do banco de dados de maneira assíncrona.
4.  **Resiliência:** Se o servidor do RabbitMQ falhar ou estiver offline, o sistema ativa uma degradação graciosa. O log é impresso no console local e a API continua processando requisições sem travar ou rejeitar a ação do usuário.

### Sistema de Caching Resiliente
O `DistributedCacheService` opera com resiliência:
*   Durante a inicialização da API, o sistema tenta se conectar à instância configurada do Redis.
*   Em caso de falha de conexão (porta fechada ou timeout), o backend ativa o `InMemoryCacheService` (L1), mantendo a capacidade de cache local na memória da aplicação e emitindo um aviso no log do console.

---

## 4. Módulos e Entidades de Negócio

O esquema de banco de dados e as classes em `backend/src/models` revelam a abrangência das regras de negócio do condomínio:

*   **Autenticação e Perfis (`Usuario`, `CategoriaAcesso`):**
    *   Segurança implementada via hashes de senhas e tokens JWT.
    *   Diferenciação de acessos via perfis específicos: Morador, Funcionário e Administrador.
*   **Gestão de Pessoas (`Morador`, `Funcionario`, `CategoriaCargo`):**
    *   Vinculação de funcionários a seus respectivos cargos operacionais.
    *   Moradores associados a informações de apartamento e contatos.
*   **Quadro de Avisos (`Aviso`):**
    *   Comunicados oficiais do condomínio com data de início e expiração automáticas para exibição nos murais digitais.
*   **Gestão de Encomendas (`Encomenda`, `CategoriaEncomenda`):**
    *   Rastreamento detalhado desde a chegada na portaria até a retirada pelo morador (registrando datas UTC de recepção e entrega).
*   **Reclamações (`Reclamacao`, `CategoriaReclamacao`):**
    *   Canal direto do morador para expor problemas estruturais ou de convivência, com acompanhamento de status.
*   **Reservas de Áreas (`Reserva`, `Local`, `CategoriaReserva`):**
    *   Reserva de espaços (salão de festas, churrasqueira, etc.) com validações rígidas no `ReservaService` para prevenir sobreposições de horários de uso na mesma área.
*   **Visitantes (`Visitante`, `AcessoVisitante`):**
    *   Mapeamento de visitas com registro detalhado da hora de entrada e saída.

---

## 5. Estado Atual do Projeto

### Execução Local
Atualmente, o projeto possui duas tarefas ativas e coordenadas na máquina de desenvolvimento:
1.  **Backend em Execução Contínua:** `dotnet watch` monitora alterações de arquivos C# em tempo real em `backend`, permitindo reinicialização automática em modo hot-reload.
2.  **Frontend em Desenvolvimento:** `npm run dev` executando o Vite em `frontend` na porta `5173`.

### Suíte de Testes
O projeto possui testes unitários implementados no diretório `backend.Tests` focados nas regras cruciais de serviços:
*   `AuthServiceTests`: Validações de login, criação de tokens e controle de acessos.
*   `EncomendaServiceTests`: Regras de entrega e recebimento de pacotes.
*   `ReclamacaoServiceTests`: Fluxo de abertura e alteração de status de reclamações.
*   `ReservaServiceTests`: Lógica de verificação de conflitos de data e hora para agendamentos.

### CI/CD e Versionamento
*   Pipeline integrada com GitHub Actions e semantic-release, garantindo que alterações mescladas à branch principal gerem novos lançamentos versionados (como o atual `1.6.4` do repositório root e `1.1.0` do frontend) com documentação automática no CHANGELOG.
