import { Label, TextInput, Button, Card } from "flowbite-react";
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
                nome, cpf, senha, tipoUsuario,
                apartamento, bloco, cargo, telefone, email, rg
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

            <Card className="w-full max-w-3xl bg-blue-600 text-white shadow-lg px-8 py-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Tipo de usuário */}
                    <div className="flex justify-center gap-4">
                        <Button
                            type="button"
                            color="white"
                            onClick={() => setTipoUsuario("MORADOR")}
                            className={`${tipoUsuario === "MORADOR" ? " bg-green-500 text-zinc-300" : "bg-blue-500 text-white"}`}
                        >
                            Morador
                        </Button>
                        <Button
                            type="button"
                            color={"white"}
                            onClick={() => setTipoUsuario("FUNCIONARIO")}
                            className={`${tipoUsuario === "FUNCIONARIO" ? "bg-green-500 text-zinc-300" : "bg-blue-500 text-white"}`}
                        >
                            Funcionário
                        </Button>
                    </div>

                    {/* Campos em pares */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <Label htmlFor="nome" className="flex items-center gap-1">
                            Nome:<span className="text-red-500">*</span>
                            </Label>
                            <TextInput id="nome" placeholder="Digite seu nome" onChange={(e) => setNome(e.target.value)} required />
                        </div>
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <Label htmlFor="cpf" className="flex items-center gap-1">
                                CPF:<span className="text-red-500">*</span>
                            </Label>
                            <TextInput id="cpf" placeholder="Digite seu CPF" onChange={(e) => setCpf(e.target.value)} required />
                        </div>
                        {tipoUsuario === "MORADOR" && (
                            <>
                                <div className="flex flex-col flex-1 min-w-[200px]">
                                    <Label htmlFor="apartamento" className="flex items-center gap-1">
                                        Apartamento:<span className="text-red-500">*</span>
                                    </Label>
                                    <TextInput id="apartamento" placeholder="Digite seu apartamento" onChange={(e) => setApartamento(e.target.value)} required />
                                </div>
                                <div className="flex flex-col flex-1 min-w-[200px]">
                                    <Label htmlFor="bloco" className="flex items-center gap-1">
                                        Bloco:<span className="text-red-500">*</span>
                                    </Label>
                                    <TextInput id="bloco" placeholder="Digite seu bloco" onChange={(e) => setBloco(e.target.value)} required />
                                </div>
                            </>
                        )}
                        {tipoUsuario === "FUNCIONARIO" && (
                            <div className="flex flex-col flex-1 min-w-[200px]">
                                <Label htmlFor="cargo" className="flex items-center gap-1">
                                    Cargo:<span className="text-red-500">*</span>
                                </Label>
                                <TextInput id="cargo" placeholder="Digite seu cargo" onChange={(e) => setCargo(e.target.value)} required />
                            </div>
                        )}
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <Label htmlFor="telefone" className="flex items-center gap-1">
                                Telefone:
                            </Label>
                            <TextInput id="telefone" placeholder="Digite seu telefone" onChange={(e) => setTelefone(e.target.value)}/>
                        </div>
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <Label htmlFor="email" className="flex items-center gap-1">
                                Email:
                            </Label>
                            <TextInput id="email" type="email" placeholder="Digite seu email" onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <Label htmlFor="rg" className="flex items-center gap-1">
                                RG:
                            </Label>
                            <TextInput id="rg" placeholder="Digite seu RG" onChange={(e) => setRg(e.target.value)}/>
                        </div>
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <Label htmlFor="senha" className="flex items-center gap-1">
                                Senha:<span className="text-red-500">*</span>
                            </Label>
                            <TextInput id="senha" type="password" placeholder="Digite sua senha" onChange={(e) => setSenha(e.target.value)} required />
                        </div>
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <Label htmlFor="confirmarSenha" className="flex items-center gap-1">
                                Confirmar Senha:<span className="text-red-500">*</span>
                            </Label>
                            <TextInput id="confirmarSenha" type="password" placeholder="Confirme sua senha" onChange={(e) => setConfirmarSenha(e.target.value)} required />
                        </div>
                    </div>

                    <Button type="submit" className="bg-white text-white hover:bg-gray-200 transition w-full">
                        Cadastrar
                    </Button>
                    {erro && <p className="text-red-300 text-sm text-center">{erro}</p>}
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
