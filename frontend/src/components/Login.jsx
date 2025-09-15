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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
                <h1 className="text-5xl font-extrabold text-blue-700 mb-2 tracking-tight font-cursive">CondoSync</h1>
                <h2 className="text-2xl font-semibold text-blue-500 mb-8">LOGIN</h2>
                <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="cpf" className="text-blue-700 font-medium">CPF:</label>
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
                        <label htmlFor="senha" className="text-blue-700 font-medium">Senha:</label>
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
                        className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-xl font-bold shadow-md hover:scale-105 transition-transform duration-200"
                    >
                        Entrar
                    </button>
                    {erro && <p className="text-sm text-red-500 text-center font-semibold mt-2">{erro}</p>}
                </form>
                <p className="text-sm text-center mt-6 text-blue-700">
                    Não possui uma conta?{" "}
                    <Link to="/cadastro" className="underline font-bold hover:text-blue-400">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;