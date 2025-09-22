import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, validarCpfApi } from "../services/userService";


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
    const [cpfValidado, setCpfValidado] = useState(false);
    const [validandoCpf, setValidandoCpf] = useState(false);
    const [cpfErro, setCpfErro] = useState("");

    const navigate = useNavigate();

    const handleValidarCpf = async () => {
        setCpfErro("");
        setValidandoCpf(true);
        try {
            // const valido = await validarCpfApi(cpf);
            const valido = true // TESTES
            if (valido) {
                setCpfValidado(true);
            } else {
                setCpfErro("CPF inválido. Verifique e tente novamente.");
                setCpfValidado(false);
            }
        } catch (err) {
            setCpfErro(err.message || "Erro ao validar CPF. Tente novamente.");
            setCpfValidado(false);
        }
        setValidandoCpf(false);
    };

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
                <h1 className="text-5xl font-extrabold text-blue-700 mb-2 tracking-tight font-cursive">CondoSync</h1>
                <h2 className="text-2xl font-semibold text-blue-500 mb-8">CADASTRE-SE</h2>

                {/* Seção de validação de CPF */}
                <div className="w-full max-w-md mb-8 bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center">
                    <label htmlFor="cpf" className="font-medium text-blue-700 mb-2 text-lg">Digite seu CPF para validação:</label>
                    <div className="flex w-full gap-2">
                        <input
                            id="cpf"
                            type="text"
                            placeholder="CPF"
                            value={cpf}
                            onChange={(e) => { setCpf(e.target.value); setCpfValidado(false); setCpfErro(""); }}
                            className="flex-1 rounded-xl p-3 border border-blue-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={cpfValidado || validandoCpf}
                        />
                        <button
                            type="button"
                            onClick={handleValidarCpf}
                            className={`px-6 py-2 rounded-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:scale-105 transition-transform duration-200 ${cpfValidado ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={cpfValidado || validandoCpf || !cpf}
                        >
                            {validandoCpf ? "Validando..." : "Validar"}
                        </button>
                    </div>
                    {cpfValidado && <p className="text-green-600 font-semibold mt-2">CPF válido! Preencha seus dados abaixo.</p>}
                    {cpfErro && <p className="text-red-500 font-semibold mt-2">{cpfErro}</p>}
                </div>

                {/* Formulário de cadastro só aparece após CPF validado */}
                {cpfValidado && (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
                        {/* Tipo de usuário */}
                        <div className="flex justify-center gap-6 mb-2">
                            <button
                                type="button"
                                onClick={() => setTipoUsuario("MORADOR")}
                                className={`px-6 py-2 rounded-xl font-bold transition-colors shadow-md border-2 ${
                                    tipoUsuario === "MORADOR"
                                        ? "bg-green-400 text-white border-green-500 scale-105"
                                        : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                }`}
                            >
                                Morador
                            </button>
                            <button
                                type="button"
                                onClick={() => setTipoUsuario("FUNCIONARIO")}
                                className={`px-6 py-2 rounded-xl font-bold transition-colors shadow-md border-2 ${
                                    tipoUsuario === "FUNCIONARIO"
                                        ? "bg-green-400 text-white border-green-500 scale-105"
                                        : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                }`}
                            >
                                Funcionário
                            </button>
                        </div>
                        {/* Campos em pares */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex flex-col flex-1 min-w-[220px]">
                                <label htmlFor="nome" className="font-medium text-blue-700 mb-1">Nome:<span className="text-red-500">*</span></label>
                                <input
                                    id="nome"
                                    type="text"
                                    placeholder="Digite seu nome"
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                    className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            {tipoUsuario === "MORADOR" && (
                                <>
                                    <div className="flex flex-col flex-1 min-w-[220px]">
                                        <label htmlFor="apartamento" className="font-medium text-blue-700 mb-1">Apartamento:<span className="text-red-500">*</span></label>
                                        <input
                                            id="apartamento"
                                            type="text"
                                            placeholder="Digite seu apartamento"
                                            onChange={(e) => setApartamento(e.target.value)}
                                            required
                                            className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-[220px]">
                                        <label htmlFor="bloco" className="font-medium text-blue-700 mb-1">Bloco:<span className="text-red-500">*</span></label>
                                        <input
                                            id="bloco"
                                            type="text"
                                            placeholder="Digite seu bloco"
                                            onChange={(e) => setBloco(e.target.value)}
                                            required
                                            className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                </>
                            )}
                            {tipoUsuario === "FUNCIONARIO" && (
                                <div className="flex flex-col flex-1 min-w-[220px]">
                                    <label htmlFor="cargo" className="font-medium text-blue-700 mb-1">Cargo:<span className="text-red-500">*</span></label>
                                    <input
                                        id="cargo"
                                        type="text"
                                        placeholder="Digite seu cargo"
                                        onChange={(e) => setCargo(e.target.value)}
                                        required
                                        className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col flex-1 min-w-[220px]">
                                <label htmlFor="telefone" className="font-medium text-blue-700 mb-1">Telefone:</label>
                                <input
                                    id="telefone"
                                    type="text"
                                    placeholder="Digite seu telefone"
                                    onChange={(e) => setTelefone(e.target.value)}
                                    className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[220px]">
                                <label htmlFor="email" className="font-medium text-blue-700 mb-1">Email:</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[220px]">
                                <label htmlFor="rg" className="font-medium text-blue-700 mb-1">RG:</label>
                                <input
                                    id="rg"
                                    type="text"
                                    placeholder="Digite seu RG"
                                    onChange={(e) => setRg(e.target.value)}
                                    className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[220px]">
                                <label htmlFor="senha" className="font-medium text-blue-700 mb-1">Senha:<span className="text-red-500">*</span></label>
                                <input
                                    id="senha"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                    className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[220px]">
                                <label htmlFor="confirmarSenha" className="font-medium text-blue-700 mb-1">Confirmar Senha:<span className="text-red-500">*</span></label>
                                <input
                                    id="confirmarSenha"
                                    type="password"
                                    placeholder="Confirme sua senha"
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                    className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-xl font-bold shadow-md hover:scale-105 transition-transform duration-200 mt-2"
                        >
                            Cadastrar
                        </button>
                        {erro && <p className="text-red-500 text-sm text-center font-semibold mt-2">{erro}</p>}
                    </form>
                )}
                <p className="text-sm text-center mt-8 text-blue-700">
                    Já possui uma conta?{" "}
                    <Link to="/login" className="underline font-bold hover:text-blue-400">
                        Realizar Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;