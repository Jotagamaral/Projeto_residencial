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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-cursive mb-4">CondoSync</h1>
            <h2 className="text-xl font-semibold mb-6">LOGIN</h2>

            <div className="w-80 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="cpf" className="text-white mb-1 block">
                            CPF:
                        </label>
                        <input
                            id="cpf"
                            type="text"
                            placeholder="Digite seu CPF"
                            required
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="senha" className="text-white mb-1 block">
                            Senha:
                        </label>
                        <input
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500 text-white p-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                        Entrar
                    </button>

                    {erro && <p className="text-sm text-red-300 text-center">{erro}</p>}
                </form>

                <p className="text-sm text-center mt-4">
                    Não possui uma conta?{" "}
                    <Link to="/cadastro" className="underline hover:text-gray-200">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;