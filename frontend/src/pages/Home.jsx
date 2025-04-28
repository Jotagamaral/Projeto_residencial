// pages/Home.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CustomSidebar from "../components/CustomSidebar";
import Card from "../components/Card";
import AvisoList from "../components/AvisoList"; // importar o novo componente
import { buscarAvisos } from "../services/avisosService"; // importar o serviço

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
        <div className="flex justify-center gap-2 mt-10">
          <Card title="Reclamações" />
          <Card title="Reservas" />
          <Card title="Encomendas" />
        </div>


        {/* Área de Avisos */}
        <div className="mt-10 px-8">
          {loading && <p>Carregando avisos...</p>}
          {erro && <p className="text-red-500">{erro}</p>}
          {!loading && !erro && <AvisoList avisos={avisos} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
