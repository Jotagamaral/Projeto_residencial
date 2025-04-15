import { Label, TextInput, Button, Card } from "flowbite-react";
import { useState } from "react";
import { loginUser } from "../services/api";

function Login() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");

        try {
            const response = await loginUser(cpf, senha);
            console.log("Login bem-sucedido!", response);

        // localStorage.setItem("token", response.token);
        } catch (err) {
            setErro("CPF ou senha inválidos.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-cursive mb-4">Condosync</h1>
        <h2 className="text-xl font-semibold mb-6">LOGIN</h2>

        <Card className="w-80 bg-blue-600 text-white">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
                <Label htmlFor="cpf" value="CPF:" className="text-white" />
                <TextInput
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="senha" value="Senha:" className="text-white" />
                <TextInput
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1"
                />
            </div>

            <Button type="submit" className="bg-white text-white hover:bg-gray-200">
                Entrar
            </Button>

            {erro && <p className="text-sm text-red-300 text-center">{erro}</p>}
            </form>
        </Card>
        </div>
    );
}

export default Login;
