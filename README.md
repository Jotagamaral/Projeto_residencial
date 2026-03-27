graph TD
    %% ==================================================
    %% PROJETO CONDOSYNC (2026) - ESTRUTURA COMPLETA
    %% ==================================================

    subgraph Identificacao [0. Identificação do Projeto]
        A[<b>CondoSync</b><br/>Sistema de Gestão de Condomínio] --> B[Projeto Integrador 2026]
        B --> C[Ciência da Computação]
        C --> D[Equipe: Daví, João, Henrique, Thales e Gabriel]
    end

    subgraph VisaoGeral [1. Introdução e Objetivos]
        E[Centralizar Gestão Administrativa] --- F[Melhorar Comunicação]
        F --- G[Organizar Reservas e Encomendas]
        G --- H[Controle de Visitantes e Reclamações]
    end

    subgraph TechStack [2. Tecnologias Utilizadas]
        I[Frontend: React + Vite]
        J[Backend: .NET C#]
        K[Banco: PostgreSQL Supabase]
        L[Componentes: C# Auxiliares]
    end

    subgraph Atores [3. Perfis de Usuário]
        M{Categorias de Acesso}
        M -->|Gestão| N[Administrador/Síndico]
        M -->|Operacional| O[Funcionário/Portaria]
        M -->|Residente| P[Morador]
    end

    subgraph Database [4. Modelagem de Dados - Entidades]
        direction LR
        subgraph Nucleo [Core]
            U[Usuário - PK: ID_USER]
            U --- M1[Morador - 1:1]
            U --- F1[Funcionário - 1:1]
        end
        subgraph Operacional [Operações]
            E1[Encomendas]
            R1[Reservas]
            REC[Reclamações]
            V1[Visitantes]
            AV[Avisos]
            LO[Locais]
        end
        subgraph Auditoria [Segurança]
            CSTBH[Tabelas de Histórico/Auditoria]
        end
    end

    subgraph Regras [5. Regras de Negócio Principais]
        RN1[Morador: Apenas apartamentos/blocos válidos]
        RN2[Visitantes: Sempre vinculados a um morador]
        RN3[Reservas/Reclamações: Exclusivas para moradores]
        RN4[Encomendas: Registro exclusivo por funcionários]
        RN5[Avisos: Criação exclusiva por administradores]
    end

    subgraph Requisitos [6. Requisitos Funcionais - RFs]
        direction TB
        RF1[RF01/02: Cadastrar Moradores e Funcionários]
        RF2[RF03: Cadastrar Visitantes]
        RF3[RF04/05: Registrar Avisos e Reclamações]
        RF4[RF06/07: Registrar Reservas e Encomendas]
        RF5[RF08/09/10: Consultar Dados]
    end

    %% Conexões de Hierarquia
    Identificacao --> VisaoGeral
    VisaoGeral --> TechStack
    TechStack --> Atores
    Atores --> Database
    Database --> Regras
    Regras --> Requisitos
    Requisitos --> FIM[Conclusão: Solução Tecnológica Integrada]

    %% Estilização
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style TechStack fill:#e1f5fe,stroke:#01579b
    style Database fill:#fff3e0,stroke:#e65100
    style Regras fill:#f1f8e9,stroke:#33691e
