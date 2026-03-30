### Visão Geral do Projeto
```mermaid
flowchart TD
    %% 1. IDENTIFICAÇÃO E INTRODUÇÃO
    subgraph Introducao [1. Projeto CondoSync - 2026]
        A(CondoSync: Sistema de Gestão de Condomínio) --- B(Objetivo: Centralizar gestão e melhorar comunicação)
        B --- C(Escopo: Moradores, Funcionários, Visitantes, Avisos, Reservas e Encomendas)
    end

    %% 2. TECNOLOGIAS
    subgraph Tecnologias [2. Tecnologias Utilizadas]
        T1(Frontend: React com Vite)
        T2(Backend: .NET C#)
        T3(Banco de Dados: PostgreSQL / Supabase)
    end

    %% 3. PERFIS DE USUÁRIO
    subgraph Perfis [3. Perfis e Permissões]
        P1(Administrador: Gestão total e Avisos)
        P2(Funcionário: Operacional, Encomendas e Visitantes)
        P3(Morador: Reservas, Reclamações e Consultas)
    end

    %% 4. MODELAGEM DE DADOS (ENTIDADES)
    subgraph DB [4. Modelagem do Banco de Dados]
        direction LR
        E1(Usuários / Moradores / Funcionários) --- E2(Visitantes / Controle de Acesso)
        E2 --- E3(Encomendas / Reservas / Locais)
        E3 --- E4(Reclamações / Avisos)
        E4 --- E5(Auditoria: Tabelas CSTBH)
    end

    %% 5. REGRAS DE NEGÓCIO
    subgraph Regras [5. Regras de Negócio]
        R1(Moradores: Devem ter bloco e apto)
        R2(Visitantes: Vinculados a um morador)
        R3(Reservas: Apenas para moradores)
        R4(Encomendas: Registro apenas por funcionários)
    end

    %% 6. REQUISITOS FUNCIONAIS
    subgraph RF [6. Requisitos Funcionais - RF01 a RF10]
        F1(Cadastros: Morador, Funcionario, Visitante)
        F2(Registros: Avisos, Reclamacoes, Reservas, Encomendas)
        F3(Consultas: Moradores, Reservas, Encomendas)
    end

    %% FLUXO PRINCIPAL
    Introducao --> Tecnologias
    Tecnologias --> Perfis
    Perfis --> DB
    DB --> Regras
    Regras --> RF
    RF --> FIM(Conclusão: Solução digital integrada para condomínios)

    %% ESTILIZAÇÃO
    style Introducao fill:#f5f5f5,stroke:#333
    style Tecnologias fill:#e1f5fe,stroke:#01579b
    style DB fill:#fff3e0,stroke:#e65100
    style RF fill:#f1f8e9,stroke:#33691e
