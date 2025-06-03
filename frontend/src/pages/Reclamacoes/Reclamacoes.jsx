import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import ReclamacoesList from "../../components/ReclamacoesList"; // importar o novo componente
import { buscarReclamacoes } from "../../services/reclamacoeService"; // importar o serviço

function Reclamacoes() {

    const [reclamacoes, setReclamacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
      async function carregarReclamacoes() {
        try {
          const dados = await buscarReclamacoes();
          console.log("Dados na Reclamação.jsx:", dados);
          setReclamacoes(dados);
        } catch (error) {
          console.log("Erro:", error)
          setErro("Erro ao carregar reclamacoes.");
        } finally {
          console.log("Dados na reclamacao final:", reclamacoes);
          setLoading(false);
        }
      }
      carregarReclamacoes();
    }, []);

    return (
        <div className="flex bg-gray-100 min-h-screen">
          <CustomSidebar />
          <div className="w-full">
            <Navbar />
            <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="mt-10 px-8">
                {loading && <p>Carregando Reclamações...</p>}
                {!loading && erro && <p className="text-red-500">{erro}</p>}
                {!loading && !erro && <ReclamacoesList reclamacoes={reclamacoes} />}
            </div>
            </div>
          </div>
        </div>
      );
    }

export default Reclamacoes;