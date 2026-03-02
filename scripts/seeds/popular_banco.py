import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from faker import Faker
import random


# Carrega as variáveis do arquivo .env para o ambiente do sistema
load_dotenv()



# Configurações de Conexão
DB_URL = os.getenv("SEED_DB_CONNECTION")
engine = create_engine(DB_URL)
fake = Faker('pt_BR')

# # Configurações de Conexão (Pode ser via Variável de Ambiente)
# DB_URL = "postgresql://usuario:senha@localhost:5432/nome_do_banco"
# engine = create_engine(DB_URL)
# fake = Faker('pt_BR')

def populate_database(num_registros=20):
    try:
        with engine.begin() as conn:
            print("--- Iniciando Semeadura de Dados ---")

            # 1. Inserir Categorias (Domínios)
            # Usamos 'ON CONFLICT' para evitar erros se rodar o script duas vezes
            conn.execute(text("""
                INSERT INTO "CSTB010_CATEGORIA_ACESSO" ("NO_CATEGORIA_ACESSO") 
                VALUES ('ADMIN'), ('MORADOR'), ('FUNCIONARIO')
                ON CONFLICT DO NOTHING;
            """))

            # 2. Gerar Usuários e Moradores
            for _ in range(num_registros):
                # Criar Usuário
                res = conn.execute(text("""
                    INSERT INTO "CSTB001_USER" ("NR_CPF", "NO_PESSOA", "EM_PESSOAL", "ID_CATEGORIA_ACESSO", "TX_SENHA")
                    VALUES (:cpf, :nome, :email, 2, :senha)
                    RETURNING "ID_USER";
                """), {
                    "cpf": "".join([str(random.randint(0, 9)) for _ in range(11)]),
                    "nome": fake.name(),
                    "email": fake.email(),
                    "senha": "hash_seguro_faker"
                })
                
                user_id = res.fetchone()[0]

                # Criar Perfil de Morador vinculado ao ID retornado
                conn.execute(text("""
                    INSERT INTO "CSTB002_MORADOR" ("ID_USER", "IC_BLOCO", "NR_APARTAMENTO")
                    VALUES (:uid, :bloco, :apto);
                """), {
                    "uid": user_id,
                    "bloco": random.choice(['A', 'B', 'C']),
                    "apto": random.randint(101, 909)
                })

            print(f"✓ {num_registros} usuários e moradores inseridos com sucesso!")

    except Exception as e:
        print(f"❌ Erro ao popular banco: {e}")

if __name__ == "__main__":
    populate_database(50)