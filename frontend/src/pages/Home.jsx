// pages/Home.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CustomSidebar from "../components/CustomSidebar";
import Card from "../components/Card";
import AvisoList from "../components/AvisoList"; // importar o novo componente
import { buscarAvisos } from "../services/avisosService"; // importar o serviço
import { Link } from "react-router-dom"; // importar o Link do react-router-dom

function Home() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarAvisos() {
      try {
        const dados = await buscarAvisos();
        setAvisos(dados);
      } catch (error) {
        setErro("Erro ao carregar avisos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregarAvisos();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CustomSidebar />
      <div className="w-full">
        <Navbar />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 px-4 w-full h-[150px] sm:h-[200px]">
          <Link
            to="/reclamacoes"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-2xl shadow-md transition-all duration-300 w-full h-full"
          >
            Reclamações
          </Link>
          <Link
            to="/reservas"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-2xl shadow-md transition-all duration-300 w-full h-full"
          >
            Reservas
          </Link>
          <Link
            to="/encomendas"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-2xl shadow-md transition-all duration-300 w-full h-full"
          >
            Encomendas
          </Link>
        </div>


        {/* Área de Avisos */}
        <div className="mt-10 px-8">
          {loading && <p>Carregando avisos...</p>}
          {!loading && erro && <p className="text-red-500">{erro}</p>}
          {!loading && !erro && <AvisoList avisos={avisos} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
