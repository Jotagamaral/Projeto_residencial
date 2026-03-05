import os
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from faker import Faker

load_dotenv()

SEED_USER = os.getenv("SEED_USER")
SEED_PASSWORD = os.getenv("SEED_PASSWORD")
SEED_HOST = os.getenv("SEED_HOST")
SEED_PORT = os.getenv("SEED_PORT")
SEED_DBNAME = os.getenv("SEED_DBNAME")

DB_URL = f"postgresql+psycopg2://{SEED_USER}:{SEED_PASSWORD}@{SEED_HOST}:{SEED_PORT}/{SEED_DBNAME}?sslmode=require"

engine = create_engine(DB_URL)
fake = Faker('pt_BR')

def populate_full_database(qtd_moradores=20, qtd_funcionarios=5, qtd_visitantes=10):
    try:
        with engine.begin() as conn:
            print("--- Iniciando Semeadura Completa de Dados ---")

            # ==========================================
            # 1. TABELAS DE DOMÍNIO E LOCAIS
            # ==========================================
            print("Populando Domínios e Locais...")
            
            dom_acesso = [('ADMIN',), ('MORADOR',), ('FUNCIONARIO',)]
            dom_cargo = [('ZELADOR',), ('PORTEIRO',), ('SEGURANCA',), ('SINDICO',)]
            dom_encomenda = [('PENDENTE',), ('ENTREGUE',), ('DEVOLVIDA',)]
            dom_reclamacao = [('ABERTA',), ('EM ANALISE',), ('CONCLUIDA',)]
            dom_reserva = [('PENDENTE',), ('CONFIRMADA',), ('CANCELADA',)]
            locais = [('Salão de Festas', 50), ('Churrasqueira', 20), ('Piscina', 30), ('Quadra', 15)]

            # Inserção de Domínios
            conn.execute(text('INSERT INTO "CSTB010_CATEGORIA_ACESSO" ("NO_CATEGORIA_ACESSO") VALUES (:nome)'), [{"nome": n[0]} for n in dom_acesso])
            conn.execute(text('INSERT INTO "CSTB011_CATEGORIA_CARGO" ("NO_CATEGORIA_CARGO") VALUES (:nome)'), [{"nome": n[0]} for n in dom_cargo])
            conn.execute(text('INSERT INTO "CSTB012_CATEGORIA_ENCOMENDA" ("NO_CATEGORIA_ENCOMENDA") VALUES (:nome)'), [{"nome": n[0]} for n in dom_encomenda])
            conn.execute(text('INSERT INTO "CSTB013_CATEGORIA_RECLAMACAO" ("NO_CATEGORIA_RECLAMACAO") VALUES (:nome)'), [{"nome": n[0]} for n in dom_reclamacao])
            conn.execute(text('INSERT INTO "CSTB014_CATEGORIA_RESERVA" ("NO_CATEGORIA_RESERVA") VALUES (:nome)'), [{"nome": n[0]} for n in dom_reserva])
            
            # Inserção de Locais
            conn.execute(text('INSERT INTO "CSTB008_LOCAL" ("NO_LOCAL", "NR_CAPACIDADE") VALUES (:nome, :cap)'), [{"nome": l[0], "cap": l[1]} for l in locais])

            # Obter IDs dos domínios gerados
            id_cat_admin = conn.execute(text("SELECT \"ID_CATEGORIA_ACESSO\" FROM \"CSTB010_CATEGORIA_ACESSO\" WHERE \"NO_CATEGORIA_ACESSO\" = 'ADMIN'")).scalar()
            id_cat_morador = conn.execute(text("SELECT \"ID_CATEGORIA_ACESSO\" FROM \"CSTB010_CATEGORIA_ACESSO\" WHERE \"NO_CATEGORIA_ACESSO\" = 'MORADOR'")).scalar()
            id_cat_func = conn.execute(text("SELECT \"ID_CATEGORIA_ACESSO\" FROM \"CSTB010_CATEGORIA_ACESSO\" WHERE \"NO_CATEGORIA_ACESSO\" = 'FUNCIONARIO'")).scalar()
            
            cargos_ids = [row[0] for row in conn.execute(text('SELECT "ID_CATEGORIA_CARGO" FROM "CSTB011_CATEGORIA_CARGO"')).fetchall()]
            locais_ids = [row[0] for row in conn.execute(text('SELECT "ID_LOCAL" FROM "CSTB008_LOCAL"')).fetchall()]

            # ==========================================
            # 2. TABELAS NÚCLEO (Usuários, Moradores, Funcionários)
            # ==========================================
            print("Populando Usuários, Moradores e Funcionários...")
            moradores_criados = []
            funcionarios_criados = []

            def create_user(categoria_id):
                return conn.execute(text("""
                    INSERT INTO "CSTB001_USER" ("NR_CPF", "NO_PESSOA", "NR_RG", "EM_PESSOAL", "NR_CELULAR", "ID_CATEGORIA_ACESSO", "TX_SENHA")
                    VALUES (:cpf, :nome, :rg, :email, :celular, :cat, :senha) RETURNING "ID_USER"
                """), {
                    "cpf": fake.unique.numerify('###########'),
                    "nome": fake.name(),
                    "rg": fake.unique.numerify('########-X'),
                    "email": fake.unique.email(),
                    "celular": fake.numerify('###########'),
                    "cat": categoria_id,
                    "senha": "hash_seguro_faker"
                }).scalar()

            # Criar 1 Admin para testes
            admin_id = create_user(id_cat_admin)

            # Criar Funcionários
            for _ in range(qtd_funcionarios):
                uid = create_user(id_cat_func)
                fid = conn.execute(text("""
                    INSERT INTO "CSTB003_FUNCIONARIO" ("ID_USER", "ID_CATEGORIA_CARGO") 
                    VALUES (:uid, :cargo) RETURNING "ID_FUNCIONARIO"
                """), {"uid": uid, "cargo": random.choice(cargos_ids)}).scalar()
                funcionarios_criados.append(fid)

            # Criar Moradores
            for _ in range(qtd_moradores):
                uid = create_user(id_cat_morador)
                mid = conn.execute(text("""
                    INSERT INTO "CSTB002_MORADOR" ("ID_USER", "IC_BLOCO", "NR_APARTAMENTO") 
                    VALUES (:uid, :bloco, :apto) RETURNING "ID_MORADOR"
                """), {
                    "uid": uid, 
                    "bloco": random.choice(['A', 'B', 'C', 'D']), 
                    "apto": random.randint(101, 1509)
                }).scalar()
                moradores_criados.append(mid)

            # ==========================================
            # 3. TABELAS DE OPERAÇÃO E HISTÓRICO
            # ==========================================
            print("Populando Visitantes, Acessos, Encomendas, Reclamações e Reservas...")
            
            # Visitantes e Acessos
            for _ in range(qtd_visitantes):
                vid = conn.execute(text("""
                    INSERT INTO "CSTB004_VISITANTE" ("NO_PESSOA", "NR_CPF", "NR_RG", "NR_TELEFONE")
                    VALUES (:nome, :cpf, :rg, :tel) RETURNING "ID_VISITANTE"
                """), {
                    "nome": fake.name(), "cpf": fake.unique.numerify('###########'), 
                    "rg": fake.unique.numerify('########-X'), "tel": fake.numerify('###########')
                }).scalar()

                # Registrar Acesso para este visitante
                conn.execute(text("""
                    INSERT INTO "CSTB015_ACESSO_VISITANTE" ("ID_VISITANTE", "ID_MORADOR", "ID_FUNCIONARIO", "DT_ENTRADA")
                    VALUES (:vid, :mid, :fid, :dt)
                """), {
                    "vid": vid, "mid": random.choice(moradores_criados), 
                    "fid": random.choice(funcionarios_criados), "dt": datetime.now() - timedelta(hours=random.randint(1, 48))
                })

            # Encomendas e Histórico de Encomendas
            for _ in range(15):
                eid = conn.execute(text("""
                    INSERT INTO "CSTB005_ENCOMENDA" ("ID_MORADOR", "ID_FUNCIONARIO", "NO_REMETENTE", "ID_CATEGORIA_ENCOMENDA")
                    VALUES (:mid, :fid, :remetente, 1) RETURNING "ID_ENCOMENDA"
                """), {
                    "mid": random.choice(moradores_criados), "fid": random.choice(funcionarios_criados), 
                    "remetente": random.choice(['Amazon', 'Mercado Livre', 'Correios'])
                }).scalar()
                
                # Simulando trigger de histórico manualmente
                conn.execute(text("""
                    INSERT INTO "CSTBH005_ENCOMENDA" ("ID_ENCOMENDA", "ID_MORADOR", "ID_FUNCIONARIO", "ID_CATEGORIA_ENCOMENDA", "IC_ACAO_REGISTRO", "ID_USER_AUDITOR")
                    VALUES (:eid, :mid, :fid, 1, 'I', :admin)
                """), {"eid": eid, "mid": random.choice(moradores_criados), "fid": random.choice(funcionarios_criados), "admin": admin_id})

            # Reclamações e Avisos
            for _ in range(5):
                conn.execute(text("""
                    INSERT INTO "CSTB006_RECLAMACAO" ("ID_MORADOR", "TX_TITULO", "DS_RECLAMACAO", "ID_CATEGORIA_RECLAMACAO")
                    VALUES (:mid, :titulo, :desc, 1)
                """), {"mid": random.choice(moradores_criados), "titulo": fake.sentence(nb_words=4), "desc": fake.text(max_nb_chars=100)})

                conn.execute(text("""
                    INSERT INTO "CSTB007_AVISO" ("ID_USER", "TX_TITULO", "DS_AVISO", "DT_EXPIRACAO")
                    VALUES (:uid, :titulo, :desc, :exp)
                """), {"uid": admin_id, "titulo": fake.sentence(nb_words=3), "desc": fake.text(), "exp": datetime.now() + timedelta(days=7)})

            # Reservas
            for _ in range(10):
                conn.execute(text("""
                    INSERT INTO "CSTB009_RESERVA" ("ID_MORADOR", "ID_LOCAL", "DT_INICIO", "DT_FIM", "ID_CATEGORIA_RESERVA")
                    VALUES (:mid, :loc, :inicio, :fim, 2)
                """), {
                    "mid": random.choice(moradores_criados), "loc": random.choice(locais_ids),
                    "inicio": datetime.now() + timedelta(days=random.randint(1, 10)),
                    "fim": datetime.now() + timedelta(days=random.randint(1, 10), hours=4)
                })

            print("✓ Banco de dados completamente populado com sucesso!")

    except Exception as e:
        print(f"❌ Erro na execução: {e}")

if __name__ == "__main__":
    populate_full_database()