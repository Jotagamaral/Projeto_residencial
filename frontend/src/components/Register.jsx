import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, validarCpfApi } from "../services/userService";


function Register() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState(2);
    const [apartamento, setApartamento] = useState("");
    const [bloco, setBloco] = useState("");
    const [cargo, setCargo] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [rg, setRg] = useState("");
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        // Preenchimento de senha
        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            setCarregando(false);
            return;
        }

        try {
            await registerUser({
                nome, cpf, senha, categoriaAcessoId: tipoUsuario, apartamento, bloco, cargo, telefone, email, rg,
            });

            navigate("/login");
        } catch (err) {
            setErro(err.message || "Erro ao cadastrar. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 p-6">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="p-4 md:p-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2 tracking-tight font-cursive">CondoSync</h1>
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-500 mb-6">CADASTRE-SE</h2>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                            {/* Input de CPF integrado ao formulário */}
                            <div className="flex flex-col">
                                <label htmlFor="cpf" className="font-medium text-blue-700 mb-1">CPF:<span className="text-red-500">*</span></label>
                                <input
                                    id="cpf"
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    required
                                    className="rounded-xl p-3 border border-blue-300 bg-blue-50 focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {/* Tipo de usuário */}
                            <div className="flex justify-start gap-4 mb-2">
                                <button
                                    type="button"
                                    // 2 (Morador)
                                    onClick={() => setTipoUsuario(2)} 
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-md border-2 ${
                                        tipoUsuario === 2
                                            ? "bg-green-400 text-white border-green-500"
                                            : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                    }`}
                                >
                                    Morador
                                </button>
                                <button
                                    type="button"
                                    // 3 (Funcionário)
                                    onClick={() => setTipoUsuario(3)} 
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-md border-2 ${
                                        tipoUsuario === 3
                                            ? "bg-green-400 text-white border-green-500"
                                            : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                    }`}
                                >
                                    Funcionário
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col flex-1 min-w-[200px]">
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
                                {tipoUsuario === 2 && (
                                    <>
                                        <div className="flex flex-col flex-1 min-w-[200px]">
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
                                        <div className="flex flex-col flex-1 min-w-[200px]">
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
                                {tipoUsuario === 3 && (
                                    <div className="flex flex-col flex-1 min-w-[200px]">
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
                                <div className="flex flex-col flex-1 min-w-[200px]">
                                    <label htmlFor="telefone" className="font-medium text-blue-700 mb-1">Telefone:</label>
                                    <input
                                        id="telefone"
                                        type="text"
                                        placeholder="Digite seu telefone"
                                        onChange={(e) => setTelefone(e.target.value)}
                                        className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 min-w-[200px]">
                                    <label htmlFor="email" className="font-medium text-blue-700 mb-1">Email:<span className="text-red-500">*</span></label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Digite seu email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 min-w-[200px]">
                                    <label htmlFor="rg" className="font-medium text-blue-700 mb-1">RG:</label>
                                    <input
                                        id="rg"
                                        type="text"
                                        placeholder="Digite seu RG"
                                        onChange={(e) => setRg(e.target.value)}
                                        className="rounded-xl p-3 border border-blue-300 bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 min-w-[200px]">
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
                                <div className="flex flex-col flex-1 min-w-[200px]">
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
                                disabled={carregando}
                                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-xl font-bold hover:scale-105 transition-all"
                                >
                                {carregando ? "Processando..." : "Finalizar Cadastro"}
                            </button>
                            {erro && <p className="text-red-500 text-sm text-left font-semibold mt-2">{erro}</p>}
                        </form>
                </div>

                {/* Coluna de Ad/Marketing - Exemplo Limpeza */}
                <aside className="p-6 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100">
                    <h3 className="text-2xl font-bold text-teal-800 mb-3">Sua casa limpa, sem esforço.</h3>
                    <p className="text-gray-700 mb-4">
                        A <span className="font-bold">LimpaLar</span> oferece serviços de limpeza profissional para seu apartamento. Agende com profissionais de confiança e aproveite seu tempo livre.
                    </p>
                    
                    <ul className="text-gray-700 list-disc list-inside mb-4 space-y-1">
                        <li>Profissionais verificados e segurados</li>
                        <li>Planos flexíveis (diária ou semanal)</li>
                        <li>Produtos de limpeza inclusos</li>
                    </ul>

                    <div className="flex items-center gap-4 mb-6">
                        <button className="px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-500 transition-colors">
                            Agendar Limpeza
                        </button>
                        <button className="px-4 py-2 border border-teal-300 rounded-lg text-teal-700 font-medium hover:bg-teal-50 transition-colors">
                            Ver Planos
                        </button>
                    </div>

                    <div>
                        <img src="/img/anuncio-limpeza-logo.png" alt="LimpaLar - Serviços de Limpeza" className="w-32 opacity-90" />
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Register;