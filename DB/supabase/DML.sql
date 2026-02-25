
Table "CSTB001_USER" {
  "ID_USER" BIGINT [pk, increment, note: 'Identificador artificial único do usuário.']
  "NR_CPF" VARCHAR(11) [unique, not null, note: 'Número do Cadastro de Pessoas Físicas, utilizado como login.']
  "NO_PESSOA" VARCHAR(150) [not null, note: 'Nome completo do usuário.']
  "NR_RG" VARCHAR(20) [unique, note: 'Número do Registro Geral de Identidade do usuário.']
  "EM_PESSOAL" VARCHAR(150) [unique, not null, note: 'Endereço de correio eletrônico do usuário.']
  "NR_CELULAR" NUMERIC(11,0) [note: 'Número de telefone de contato com 11 dígitos (DDD + Número).']
  "ID_CATEGORIA_ACESSO" VARCHAR(20) [not null, note: 'Define o nível de acesso. Valores permitidos: ADMIN, SINDICO, MORADOR, FUNCIONARIO.']
  "TX_SENHA" VARCHAR(255) [not null, note: 'Senha de acesso criptografada do usuário.']
  "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']

  Checks {
    `LENGTH(NR_CPF) = 11` [name: 'CC001_CSTB001']
    `IC_ATIVO IN ('S', 'N')` [name: 'CC002_CSTB001']
    `EM_PESSOAL LIKE '%@%'` [name: 'CC003_CSTB001']
  }
  Note: 'Armazena os dados de autenticação e credenciais do sistema. Tamanho inicial estimado: 100 registros. Crescimento anual estimado: 5%.'
}

Table "CSTB002_MORADOR" {
  "ID_MORADOR" BIGINT [pk, increment, note: 'Identificador artificial único do morador.']
  "ID_USER" BIGINT [unique, note: 'Chave estrangeira que vincula o morador aos seus dados de login.']
  "IC_BLOCO" "CHAR (1)" [not null, note: 'Letra ou número identificador do bloco do apartamento.']
  "NR_APARTAMENTO" INTEGER [not null, note: 'Número identificador da unidade do apartamento.']
  "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']

  Checks {
    `NR_APARTAMENTO > 0` [name: 'CC001_CSTB002']
    `IC_ATIVO IN ('S', 'N')` [name: 'CC002_CSTB002']
  }
  Note: 'Cadastro dos moradores responsáveis pelas unidades do condomínio. Tamanho inicial estimado: 300 registros. Crescimento anual estimado: 15%.'
}

Table "CSTB003_FUNCIONARIO" {
  "ID_FUNCIONARIO" BIGINT [pk, increment, note: 'Identificador artificial único do funcionário.']
  "ID_USER" BIGINT [unique, note: 'Chave estrangeira que vincula o funcionário aos seus dados de login.']
  "ID_CATEGORIA_CARGO" BIGINT [unique, note: 'Chave estrangeira que vincula o funcionário ao seu cargo no sistema.']
  "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']

  Checks {
    `IC_ATIVO IN ('S', 'N')` [name: 'CC001_CSTB003']
  }
  Note: 'Cadastro detalhado dos funcionários do condomínio e portaria. Tamanho inicial estimado: 20 registros. Crescimento anual estimado: 10%.'
}

Table "CSTB004_VISITANTE" {
  "ID_VISITANTE" BIGINT [pk, increment, note: 'Identificador artificial único do visitante.']
  "ID_MORADOR" BIGINT [not null, note: 'Chave estrangeira apontando para o morador que autorizou a entrada.']
  "ID_FUNCIONARIO" BIGINT [not null, note: 'Chave estrangeira apontando para o funcionário que registrou a entrada.']
  "NO_PESSOA" VARCHAR(150) [not null, note: 'Nome completo do visitante.']
  "NR_CPF" VARCHAR(11) [unique, note: 'Número do Cadastro de Pessoas Físicas do visitante.']
  "NR_RG" VARCHAR(20) [unique, not null, note: 'Número do Registro Geral de Identidade do visitante.']
  "NR_TELEFONE" NUMERIC(11,0) [note: 'Número de telefone de contato com 11 dígitos (DDD + Número).']
  "DT_ENTRADA" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`, note: 'Data e hora em que o visitante acessou o condomínio.']
  "DT_SAIDA" TIMESTAMP [note: 'Data e hora em que o visitante deixou o condomínio.']
   "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']

  Checks {
    `IC_ATIVO IN ('S', 'N')` [name: 'CC001_CSTB004']
  }

  Note: 'Registro de fluxo de entrada e saída de visitantes. Tamanho inicial estimado: 1000 registros. Crescimento anual estimado: 50%.'
}

Table "CSTB005_ENCOMENDA" {
  "ID_ENCOMENDA" BIGINT [pk, increment, note: 'Identificador artificial único da encomenda.']
  "ID_MORADOR" BIGINT [not null, note: 'Chave estrangeira do morador destinatário da encomenda.']
  "ID_FUNCIONARIO" BIGINT [not null, note: 'Chave estrangeira do funcionário que recebeu a encomenda na portaria.']
  "NO_REMETENTE" VARCHAR(150) [not null, note: 'Nome da pessoa ou empresa que enviou a encomenda.']
  "ID_CATEGORIA_ENCOMENDA" BIGINT [not null, note: 'Chave estrangeira da categoria da encomenda.']
  "DT_RECEBIDO" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`, note: 'Data e hora em que a portaria recebeu o pacote.']
  "DT_RETIRADO" TIMESTAMP [note: 'Data e hora em que o morador retirou o pacote.']
  "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']

  Checks {
    `IC_ATIVO IN ('S', 'N')` [name: 'CC001_CSTB005']
  }

  Note: 'Controle de pacotes recebidos pela portaria. Tamanho inicial estimado: 500 registros. Crescimento anual estimado: 30%.'
}

Table "CSTB006_RECLAMACAO" {
  "ID_RECLAMACAO" BIGINT [pk, increment, note: 'Identificador artificial único da reclamação.']
  "ID_MORADOR" BIGINT [not null, note: 'Chave estrangeira apontando para o morador autor da reclamação.']
  "TX_TITULO" VARCHAR(100) [not null, note: 'Título resumido do problema relatado.']
  "DS_RECLAMACAO" TEXT [not null, note: 'Texto detalhado com o conteúdo da reclamação.']
  "ID_CATEGORIA_RECLAMACAO" BIGINT [not null, note: 'Chave estrangeira apontando para o status da reclamação.']
   "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']

  Checks {
    `IC_ATIVO IN ('S', 'N')` [name: 'CC001_CSTB006']
  }

  Note: 'Livro de ocorrências digital gerado pelos moradores. Tamanho inicial estimado: 50 registros. Crescimento anual estimado: 10%.'
}

Table "CSTB007_AVISO" {
  "ID_AVISO" BIGINT [pk, increment, note: 'Identificador artificial único do aviso.']
  "TX_TITULO" VARCHAR(100) [not null, note: 'Título de destaque do aviso.']
  "DS_AVISO" TEXT [not null, note: 'Conteúdo completo do aviso publicado.']
  "DT_EXPIRACAO_AVISO" TIMESTAMP [note: 'Data a partir da qual o aviso deixa de ter validade no mural.']
  "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']
  
  Checks {
    `IC_ATIVO IN ('S', 'N')` [name: 'CC001_CSTB007']
  }
  Note: 'Quadro de avisos geral da administração. Tamanho inicial estimado: 20 registros. Crescimento anual estimado: 15%.'
}

Table "CSTB008_LOCAL" {
  "ID_LOCAL" BIGINT [pk, increment, note: 'Identificador artificial único do local.']
  "NO_LOCAL" VARCHAR(100) [unique, not null, note: 'Nome de identificação da área comum.']
  "NR_CAPACIDADE" INTEGER [not null, note: 'Número máximo de pessoas permitidas no local.']
  "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']
  
  Checks {
    `NR_CAPACIDADE > 0` [name: 'ck_locais_capacidade']
    `IC_ATIVO IN ('S', 'N')` [name: 'ck_locais_ic_ativo']
  }
  Note: 'Áreas comuns disponíveis para reserva no condomínio (ex: Churrasqueira, Salão de Festas). Tamanho inicial estimado: 10 registros. Crescimento anual estimado: 0%.'
}

Table "CSTB009_RESERVA" {
  "ID_RESERVA" BIGINT [pk, increment, note: 'Identificador artificial único da reserva.']
  "ID_MORADOR" BIGINT [not null, note: 'Chave estrangeira indicando o morador que solicitou a reserva.']
  "ID_LOCAL" BIGINT [not null, note: 'Chave estrangeira apontando para o local reservado.']
  "DT_RESERVA" DATE [not null, note: 'Data específica para a qual o local foi reservado.']
  "ID_CATEGORIA_RESERVA" BIGINT [not null, note: 'Chave estrangeira indicando o status da reserva.']
  "IC_ATIVO" "CHAR (1)" [not null, default: 'S', note: 'Indicador de exclusão lógica. S para ativo, N para inativo.']
  
  Checks {
    `IC_ATIVO IN ('S', 'N')` [name: 'ck_locais_ic_ativo']
  }

  Indexes {
    (ID_LOCAL, DT_RESERVA) [unique, name: "UK01_CSTB009"]
  }
  Note: 'Agendamento de áreas comuns pelos moradores. Tamanho inicial estimado: 150 registros. Crescimento anual estimado: 25%.'
}

Table "CSTB010_CATEGORIA_ACESSO" {
  "ID_CATEGORIA_ACESSO" BIGINT [pk, increment, note: 'Identificador artificial único do usuário.']
  "NO_CATEGORIA_ACESSO" VARCHAR(20) [not null, note: 'Define o nível de acesso. Valores permitidos: ADMIN, SINDICO, MORADOR, FUNCIONARIO.']
  
  Note: 'Armazena os dados de categoria de acesso do sistema. Tamanho inicial estimado: 4 registros. Crescimento anual estimado: 0%.'
}

Table "CSTB011_CATEGORIA_CARGO" {
  "ID_CATEGORIA_CARGO" BIGINT [pk, increment, note: 'Identificador artificial único do funcionário.']
  "NO_CATEGORIA_CARGO" VARCHAR(20) [not null, note: 'Define o nível de cargo. Valores permitidos: PORTEIRO, ZELADOR, SEGURANÇA.']
  
  Note: 'Armazena os dados de categoria de cargo do sistema. Tamanho inicial estimado: 3 registros. Crescimento anual estimado: 0%.'
}

Table "CSTB012_CATEGORIA_ENCOMENDA" {
  "ID_CATEGORIA_ENCOMENDA" BIGINT [pk, increment, note: 'Identificador artificial único do status da encomenda.']
  "NO_CATEGORIA_ENCOMENDA" VARCHAR(20) [not null, note: 'Define o status da encomenda. Valores permitidos: PENDENTE, ENTREGUE, DEVOLVIDA.']
  

  Note: 'Armazena os dados de categoria de cargo do sistema. Tamanho inicial estimado: 3 registros. Crescimento anual estimado: 0%.'
}

Table "CSTB013_CATEGORIA_RECLAMACAO" {
  "ID_CATEGORIA_RECLAMACAO" BIGINT [pk, increment, note: 'Identificador artificial único do status da reclamação.']
  "NO_CATEGORIA_RECLAMACAO" VARCHAR(20) [not null, default: 'ABERTA', note: 'Situação de atendimento. Valores: ABERTA, EM_ANALISE, RESOLVIDA.']
  
  Note: 'Armazena os dados de categoria de cargo do sistema. Tamanho inicial estimado: 3 registros. Crescimento anual estimado: 0%.'
}

Table "CSTB013_CATEGORIA_RESERVA" {
  "ID_CATEGORIA_RESERVA" BIGINT [pk, increment, note: 'Identificador artificial único do status da reserva.']
  "NO_CATEGORIA_RESERVA" VARCHAR(20) [not null, default: 'CONFIRMADA', note: 'Situação da reserva. Valores: PENDENTE, CONFIRMADA, CANCELADA.']
  
  Note: 'Armazena os dados de categoria de cargo do sistema. Tamanho inicial estimado: 3 registros. Crescimento anual estimado: 0%.'
}


Ref:"CSTB001_USER"."ID_USER" < "CSTB003_FUNCIONARIO"."ID_USER" [delete: set null]

Ref:"CSTB001_USER"."ID_USER" < "CSTB002_MORADOR"."ID_USER" [delete: set null]

Ref:"CSTB002_MORADOR"."ID_MORADOR" < "CSTB004_VISITANTE"."ID_MORADOR" [delete: cascade]

Ref:"CSTB003_FUNCIONARIO"."ID_FUNCIONARIO" < "CSTB004_VISITANTE"."ID_FUNCIONARIO"

Ref:"CSTB002_MORADOR"."ID_MORADOR" < "CSTB005_ENCOMENDA"."ID_MORADOR" [delete: cascade]

Ref:"CSTB003_FUNCIONARIO"."ID_FUNCIONARIO" < "CSTB005_ENCOMENDA"."ID_FUNCIONARIO"

Ref:"CSTB002_MORADOR"."ID_MORADOR" < "CSTB009_RESERVA"."ID_MORADOR" [delete: cascade]

Ref:"CSTB008_LOCAL"."ID_LOCAL" < "CSTB009_RESERVA"."ID_LOCAL" [delete: restrict]

Ref:"CSTB002_MORADOR"."ID_MORADOR" < "CSTB006_RECLAMACAO"."ID_MORADOR" [delete: cascade]

Table "tbh_users" {
  "id_historico" BIGINT [pk, increment, note: 'Chave primária artificial e sequencial da tabela de histórico.']
  "ic_acao_registro" "CHAR (1)" [not null, note: 'Indicador da ação realizada no registro: I (Inclusão), A (Alteração), E (Exclusão Lógica).']
  "dh_acao_registro" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`, note: 'Data e hora em que a ação foi realizada.']
  "nr_cpf_usuario_acao" VARCHAR(11) [not null, note: 'CPF do usuário logado no sistema que realizou a ação.']
  "id_user" BIGINT [not null, note: 'Identificador do registro na tabela original (users).']
  "categoria" VARCHAR(20) [not null, note: 'Espelho da coluna categoria da tabela original.']
  "cpf" VARCHAR(11) [not null, note: 'Espelho da coluna cpf da tabela original.']
  "senha" VARCHAR(255) [not null, note: 'Espelho da coluna senha da tabela original.']
  "ic_ativo" "CHAR (1)" [not null, note: 'Espelho da coluna ic_ativo da tabela original.']
  "criado_em" TIMESTAMP [not null, note: 'Espelho da coluna criado_em da tabela original.']
  "atualizado_em" TIMESTAMP [not null, note: 'Espelho da coluna atualizado_em da tabela original.']

  Checks {
    `ic_acao_registro IN ('I', 'A', 'E')` [name: 'ck_tbh_users_acao']
  }
  Note: 'Tabela de histórico de ações sobre as credenciais de usuários. Tamanho inicial estimado: 100 registros. Crescimento anual estimado: 15%. Política de expurgo: Registros com mais de 5 anos devem ser arquivados em storage secundário e removidos desta tabela.'
}

Table "tbh_moradores" {
  "id_historico" BIGINT [pk, increment, note: 'Chave primária artificial e sequencial da tabela de histórico.']
  "ic_acao_registro" "CHAR (1)" [not null, note: 'Indicador da ação realizada no registro: I (Inclusão), A (Alteração), E (Exclusão Lógica).']
  "dh_acao_registro" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`, note: 'Data e hora em que a ação foi realizada.']
  "nr_cpf_usuario_acao" VARCHAR(11) [not null, note: 'CPF do usuário logado no sistema que realizou a ação.']
  "id_morador" BIGINT [not null, note: 'Identificador do registro na tabela original (moradores).']
  "fk_user" BIGINT [note: 'Espelho da coluna fk_user da tabela original. Não possui constraint de FK neste histórico.']
  "nome" VARCHAR(150) [not null, note: 'Espelho da coluna nome da tabela original.']
  "cpf" VARCHAR(11) [not null, note: 'Espelho da coluna cpf da tabela original.']
  "rg" VARCHAR(20) [note: 'Espelho da coluna rg da tabela original.']
  "email" VARCHAR(150) [not null, note: 'Espelho da coluna email da tabela original.']
  "telefone" NUMERIC(11,0) [note: 'Espelho da coluna telefone da tabela original.']
  "bloco" "CHAR (1)" [not null, note: 'Espelho da coluna bloco da tabela original.']
  "apartamento" INTEGER [not null, note: 'Espelho da coluna apartamento da tabela original.']
  "ic_ativo" "CHAR (1)" [not null, note: 'Espelho da coluna ic_ativo da tabela original.']
  "criado_em" TIMESTAMP [not null, note: 'Espelho da coluna criado_em da tabela original.']
  "atualizado_em" TIMESTAMP [not null, note: 'Espelho da coluna atualizado_em da tabela original.']

  Checks {
    `ic_acao_registro IN ('I', 'A', 'E')` [name: 'ck_tbh_moradores_acao']
  }
  Note: 'Tabela de histórico de ações sobre o cadastro de moradores. Tamanho inicial estimado: 300 registros. Crescimento anual estimado: 25%. Política de expurgo: Manter o histórico completo; expurgo não aplicável devido a requisitos legais de auditoria condominial.'
}

Ref:"CSTB001_USER"."ID_USER" < "tbh_users"."id_user" [delete: cascade]
Ref:"CSTB002_MORADOR"."ID_MORADOR" < "tbh_moradores"."id_morador" [delete: cascade]
