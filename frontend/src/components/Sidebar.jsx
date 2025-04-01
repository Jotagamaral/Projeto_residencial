import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="w-1/5 bg-blue-500 text-white h-screen p-4 flex flex-col justify-between">
            {/* Cabeçalho fixo */}
            <div className="text-center">
                <h1 className="text-3xl font-bold">Condosync</h1>
            </div>

            {/* Links centralizados */}
            <ul className="flex flex-col gap-4 flex-grow justify-center text-center">
                <li className="font-bold"><Link to="/">HOME</Link></li>
                <li className="font-bold"><Link to="/reclamacoes">RECLAMAÇÕES</Link></li>
                <li className="font-bold"><Link to="/reservas">RESERVAS</Link></li>
                <li className="font-bold"><Link to="/avisos">AVISOS</Link></li>
                <li className="font-bold"><Link to="/encomendas">ENCOMENDAS</Link></li>
                <li className="font-bold"><Link to="/perfil">PERFIL</Link></li>
            </ul>

            {/* Botão de saída no final */}
            <div className="text-center font-bold mt-10">
                <Link to="/sair">SAIR</Link>
            </div>
        </aside>
    );
}

export default Sidebar;
