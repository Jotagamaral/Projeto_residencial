import { Label, TextInput, Button, Card } from "flowbite-react";
import { Link } from "react-router-dom";

function Register() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* Logo e título */}
        <h1 className="text-4xl font-cursive mb-4">Condosync</h1>
        <h2 className="text-xl font-semibold mb-6">CADASTRE-SE</h2>

        {/* Card de cadastro */}
        <Card className="w-80 bg-blue-600 text-white shadow-lg">
            <form className="flex flex-col gap-4">
            <div>
                <Label htmlFor="nome" value="Nome:" className="text-white" />
                <TextInput
                id="nome"
                type="text"
                placeholder="Digite seu nome"
                required
                className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="cpf" value="CPF:" className="text-white" />
                <TextInput
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                required
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
                className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="confirmarSenha" value="Confirmar Senha:" className="text-white" />
                <TextInput
                id="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                required
                className="mt-1"
                />
            </div>

            <Button type="submit" className="bg-white text_white hover:bg-gray-200 transition">
                Cadastrar
            </Button>
            </form>

            <p className="text-sm text-center mt-4">
            Já possui uma conta?{" "}
            <Link to="/login" className="underline hover:text-gray-200">
                Realizar Login
            </Link>
            </p>
        </Card>
        </div>
    );
}

export default Register;
