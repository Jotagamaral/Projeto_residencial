import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/userService";

function Register() {
const [nome, setNome] = useState("");
const [cpf, setCpf] = useState("");
const [senha, setSenha] = useState("");
const [confirmarSenha, setConfirmarSenha] = useState("");
const [erro, setErro] = useState("");
const [tipoUsuario, setTipoUsuario] = useState("MORADOR");
const [apartamento, setApartamento] = useState("");
const [bloco, setBloco] = useState("");
const [cargo, setCargo] = useState("");
const [telefone, setTelefone] = useState("");
const [email, setEmail] = useState("");
const [rg, setRg] = useState("");

const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
    setErro("As senhas não coincidem.");
    return;
    }

    try {
    const response = await registerUser({
        nome,
        cpf,
        senha,
        tipoUsuario,
        apartamento,
        bloco,
        cargo,
        telefone,
        email,
        rg,
    });
    console.log("Cadastro bem-sucedido!", response);
    navigate("/login");
    } catch (erro) {
    console.log(erro);
    setErro("Erro ao cadastrar. Tente novamente.");
    }
};

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-4xl font-cursive mb-2">Condosync</h1>
    <h2 className="text-xl font-semibold mb-4">CADASTRE-SE</h2>

    <div className="w-full max-w-3xl bg-blue-600 text-white shadow-lg p-8 rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Tipo de usuário */}
        <div className="flex justify-center gap-4">
            <button
            type="button"
            onClick={() => setTipoUsuario("MORADOR")}
            className={`p-2 rounded-lg font-medium transition-colors ${
                tipoUsuario === "MORADOR"
                ? "bg-green-500 text-zinc-300"
                : "bg-blue-500 text-white hover:bg-blue-400"
            }`}
            >
            Morador
            </button>
            <button
            type="button"
            onClick={() => setTipoUsuario("FUNCIONARIO")}
            className={`p-2 rounded-lg font-medium transition-colors ${
                tipoUsuario === "FUNCIONARIO"
                ? "bg-green-500 text-zinc-300"
                : "bg-blue-500 text-white hover:bg-blue-400"
            }`}
            >
            Funcionário
            </button>
        </div>

        {/* Campos em pares */}
        <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[200px]">
            <label htmlFor="nome" className="flex items-center gap-1 mb-1">
                Nome:<span className="text-red-500">*</span>
            </label>
            <input
                id="nome"
                type="text"
                placeholder="Digite seu nome"
                onChange={(e) => setNome(e.target.value)}
                required
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
            <label htmlFor="cpf" className="flex items-center gap-1 mb-1">
                CPF:<span className="text-red-500">*</span>
            </label>
            <input
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                onChange={(e) => setCpf(e.target.value)}
                required
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </div>
            {tipoUsuario === "MORADOR" && (
            <>
                <div className="flex flex-col flex-1 min-w-[200px]">
                <label htmlFor="apartamento" className="flex items-center gap-1 mb-1">
                    Apartamento:<span className="text-red-500">*</span>
                </label>
                <input
                    id="apartamento"
                    type="text"
                    placeholder="Digite seu apartamento"
                    onChange={(e) => setApartamento(e.target.value)}
                    required
                    className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
                <div className="flex flex-col flex-1 min-w-[200px]">
                <label htmlFor="bloco" className="flex items-center gap-1 mb-1">
                    Bloco:<span className="text-red-500">*</span>
                </label>
                <input
                    id="bloco"
                    type="text"
                    placeholder="Digite seu bloco"
                    onChange={(e) => setBloco(e.target.value)}
                    required
                    className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
            </>
            )}
            {tipoUsuario === "FUNCIONARIO" && (
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label htmlFor="cargo" className="flex items-center gap-1 mb-1">
                Cargo:<span className="text-red-500">*</span>
                </label>
                <input
                id="cargo"
                type="text"
                placeholder="Digite seu cargo"
                onChange={(e) => setCargo(e.target.value)}
                required
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            )}
            <div className="flex flex-col flex-1 min-w-[200px]">
            <label htmlFor="telefone" className="flex items-center gap-1 mb-1">
                Telefone:
            </label>
            <input
                id="telefone"
                type="text"
                placeholder="Digite seu telefone"
                onChange={(e) => setTelefone(e.target.value)}
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
            <label htmlFor="email" className="flex items-center gap-1 mb-1">
                Email:
            </label>
            <input
                id="email"
                type="email"
                placeholder="Digite seu email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
            <label htmlFor="rg" className="flex items-center gap-1 mb-1">
                RG:
            </label>
            <input
                id="rg"
                type="text"
                placeholder="Digite seu RG"
                onChange={(e) => setRg(e.target.value)}
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
            <label htmlFor="senha" className="flex items-center gap-1 mb-1">
                Senha:<span className="text-red-500">*</span>
            </label>
            <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                onChange={(e) => setSenha(e.target.value)}
                required
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
            <label htmlFor="confirmarSenha" className="flex items-center gap-1 mb-1">
                Confirmar Senha:<span className="text-red-500">*</span>
            </label>
            <input
                id="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </div>
        </div>

        <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg font-medium hover:bg-green-600 transition"
        >
            Cadastrar
        </button>
        {erro && <p className="text-red-300 text-sm text-center">{erro}</p>}
        </form>

        <p className="text-sm text-center mt-4">
        Já possui uma conta?{" "}
        <Link to="/login" className="underline hover:text-gray-200">
            Realizar Login
        </Link>
        </p>
    </div>
    </div>
);
}

export default Register;