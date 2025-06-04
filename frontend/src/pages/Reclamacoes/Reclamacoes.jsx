import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import ReclamacoesList from "../../components/ReclamacoesList"; // importar o novo componente
import { buscarReclamacoes } from "../../services/reclamacoeService"; // importar o serviço
import { useNavigate } from "react-router-dom";

function Reclamacoes() {

    const [reclamacoes, setReclamacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

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
            <button
              className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 text-lg rounded-xl flex items-center justify-center gap-3 focus:outline-none focus:shadow-outline z-50"
              onClick={() => navigate("/cadastro_reclamacao")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19" strokeWidth="3" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span className="flex items-center justify-center text-xl font-bold">Nova reclamação</span>
            </button>
          </div>
        </div>
      );
    }

export default Reclamacoes;