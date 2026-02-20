import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


function Login() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        try {
            await login(cpf, senha);
        } catch (err) {
            console.error("Erro no login:", err);
            setErro(err.message || "Ocorreu um erro desconhecido. Tente novamente.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 p-6">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Form column */}
                <div className="p-4 md:p-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2 tracking-tight font-cursive">CondoSync</h1>
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-500 mb-6">Acesse sua conta</h2>
                    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="cpf" className="text-blue-700 font-medium">CPF</label>
                            <input
                                id="cpf"
                                type="text"
                                placeholder="Digite seu CPF"
                                required
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                className="w-full p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-blue-50"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="senha" className="text-blue-700 font-medium">Senha</label>
                            <input
                                id="senha"
                                type="password"
                                placeholder="Digite sua senha"
                                required
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-blue-50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-2/3 bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-xl font-bold shadow-md hover:scale-105 transition-transform duration-200"
                        >
                            Entrar
                        </button>
                        {erro && <p className="text-sm text-red-500 text-center font-semibold mt-2">{erro}</p>}
                    </form>
                    <div className="mt-6 text-sm text-blue-700">
                        <p>Não possui uma conta? <Link to="/cadastro" className="underline font-bold hover:text-blue-400">Cadastre-se</Link></p>
                        <p className="mt-2 text-gray-500">Seus dados estão protegidos e anonimizados.</p>
                    </div>
                </div>

                {/* Coluna de Ad/Marketing - Exemplo Gás */}
                <aside className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100">
                    <h3 className="text-2xl font-bold text-amber-800 mb-3">O gás acabou no meio da receita?</h3>
                    <p className="text-gray-700 mb-4">
                        Com a <span className="font-bold">Chama Express</span>, você pede seu botijão online e recebe em menos de 40 minutos, com instalação segura e gratuita.
                    </p>
                    
                    <ul className="text-gray-700 list-disc list-inside mb-4 space-y-1">
                        <li>Entrega rápida (até 40 min)</li>
                        <li>Instalação segura inclusa</li>
                        <li>Pagamento fácil (PIX ou cartão)</li>
                    </ul>

                    <div className="flex items-center gap-4 mb-6">
                        <button className="px-5 py-2 bg-amber-600 text-white rounded-lg font-semibold shadow hover:bg-amber-500 transition-colors">
                            Pedir Agora
                        </button>
                        <button className="px-4 py-2 border border-amber-300 rounded-lg text-amber-700 font-medium hover:bg-amber-50 transition-colors">
                            Agendar
                        </button>
                    </div>

                    <div>
                        {/* Sugestão: Use o logo do parceiro ou uma imagem temática */}
                        <img src="/img/anuncio-gas-logo.png" alt="Chama Express - Entrega de Gás" className="w-32 opacity-90" />
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Login;