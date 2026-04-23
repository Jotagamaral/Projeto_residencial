 
#  CondoSync – Sistema de Gestão de Condomínios

O **CondoSync** é uma solução digital desenvolvida para otimizar a gestão de condomínios residenciais, centralizando informações administrativas e melhorando a comunicação entre moradores, funcionários e administradores.

---

##  Sobre o Projeto

Com o crescimento dos condomínios e a complexidade da gestão, muitos processos ainda são realizados de forma manual, gerando falhas, retrabalho e falta de controle.

O CondoSync surge como uma solução para digitalizar e organizar esses processos, proporcionando mais eficiência, segurança e praticidade no dia a dia condominial.

---

##  Objetivo

Facilitar a administração do condomínio por meio de uma plataforma que permite:

* Gerenciar moradores, funcionários e visitantes
* Controlar reservas de áreas comuns
* Registrar avisos e reclamações
* Monitorar encomendas

---

##  Funcionalidades Principais

* Cadastro de moradores, funcionários e visitantes
* Gestão de avisos e comunicação interna
* Registro e acompanhamento de reclamações
* Reserva de áreas comuns (salão, churrasqueira, etc.)
* Controle de encomendas
* Controle de acesso de visitantes

---

##  Perfis de Usuário

* **Administrador / Síndico**: gerencia o sistema e cria avisos
* **Funcionário / Portaria**: controla visitantes e encomendas
* **Morador**: realiza reservas, registra reclamações e acompanha avisos

---

##  Tecnologias Utilizadas

* **Frontend:** React + Vite
* **Backend:** .NET (C#)
* **Banco de Dados:** PostgreSQL (Supabase)

---

##  Banco de Dados (Resumo)

Modelo relacional com foco em integridade e organização.

### Principais entidades:

* Usuários
* Moradores
* Funcionarios
* Visitantes
* Encomendas
* Reservas
* Locais
* Avisos
* Reclamações

### Recursos adicionais:

* Auditoria de alterações
* Controle de permissões por tipo de usuário

---

##  Regras de Negocio

* Apenas moradores podem realizar reservas e registrar reclamações
* Visitantes devem estar vinculados a um morador
* Funcionários são responsáveis pelo registro de encomendas
* Administradores criam avisos
* Reservas exigem data, horário e local

---

##  Requisitos Funcionais

* Cadastro e consulta de usuários
* Registro de reservas, avisos, reclamações e encomendas
* Consulta de dados do sistema

---

##  Equipe

* 22250399 – Daví Alves Cardoso
* 22309466 – João Gabriel
* 22250409 – Henrique Rocha
* 22252016 – Thales Martins
* 22407619 – Gabriel Jesus

---

##  Documentação

A documentação completa do projeto está disponível na pasta:

👉 `docs/documentacao_condosync_abnt2.docx`


---

## ✅ Conclusão

O CondoSync centraliza e organiza os principais processos de um condomínio, trazendo mais eficiência, controle e comunicação para a gestão, além de promover a modernização de atividades que ainda são realizadas de forma manual.

