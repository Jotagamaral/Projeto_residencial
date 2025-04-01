import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Perfil() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full">
                <Navbar />
                <div className="p-10">Página de Perfil</div>
            </div>
        </div>
    );
}

export default Perfil;
