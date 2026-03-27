import { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { buscarReclamacoes } from '../../services/reclamacoeService';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaComments,
  FaPlus,
  FaSearch,
  FaFilter,
  FaUser,
  FaUserSecret,
  FaClock,
  FaChevronDown,
  FaExclamationCircle,
} from 'react-icons/fa';

function ReclamacoesList({ reclamacoes }) {
  if (!reclamacoes || reclamacoes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='flex size-16 items-center justify-center rounded-full bg-orange-50 mb-4'>
          <FaComments className='text-2xl text-orange-300' />
        </div>
        <p className='text-base font-medium text-gray-900'>
          Nenhuma reclamação encontrada
        </p>
        <p className='mt-1 text-sm text-gray-500'>
          Quando houver reclamações, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {reclamacoes.map((rec) => {
        const isAnonimo = !rec.nome || rec.nome === 'null';

        return (
          <div
            key={rec.id}
            className='group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden'
          >
            <div className='flex items-center gap-3 px-5 pt-5 pb-3'>
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                  isAnonimo ? 'bg-gray-100' : 'bg-orange-50'
                }`}
              >
                {isAnonimo ? (
                  <FaUserSecret className='text-sm text-gray-400' />
                ) : (
                  <FaUser className='text-sm text-orange-500' />
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-semibold text-gray-900 truncate'>
                  {isAnonimo ? 'Anônimo' : rec.nome}
                </p>
              </div>
            </div>

            <div className='px-5 pb-5'>
              <p className='text-sm font-bold text-gray-900 mb-1 truncate'>
                {rec.titulo}
              </p>
              <p className='text-sm text-gray-600 leading-relaxed line-clamp-3'>
                {rec.descricao}
              </p>
            </div>

            <div className='h-1 w-full bg-orange-500/0 group-hover:bg-orange-500 transition-all duration-300' />
          </div>
        );
      })}
    </div>
  );
}

function Reclamacoes() {
  const [reclamacoes, setReclamacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [tipoCargo, setTipoCargo] = useState('');
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const carregarReclamacoes = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await buscarReclamacoes();
      setReclamacoes(dados);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar reclamações.');
      // Correção: A variável 'error' agora é utilizada para registrar os detalhes técnicos da falha
      console.error(error); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setTipoCargo(userObject.categoria);
      } catch (e) {
        console.error('Erro ao parsear dados do usuário do localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    carregarReclamacoes();
  }, [carregarReclamacoes]);

  useEffect(() => {
    if (location.state?.reload) {
      carregarReclamacoes();
      window.history.replaceState({}, document.title);
    }
  }, [location, carregarReclamacoes]);

  const reclamacoesFiltradas = useMemo(() => {
    if (!busca) return reclamacoes;
    return reclamacoes.filter((rec) => {
      const termo = busca.toLowerCase();
      return (
        rec.titulo?.toLowerCase().includes(termo) ||
        rec.descricao?.toLowerCase().includes(termo) ||
        (rec.nome && rec.nome !== 'null' && rec.nome.toLowerCase().includes(termo))
      );
    });
  }, [reclamacoes, busca]);

  const handleNovaReclamacao = useCallback(() => {
    navigate('/cadastro_reclamacao');
  }, [navigate]);

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <main className='flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <div className='flex size-12 items-center justify-center rounded-2xl bg-orange-50'>
                <FaComments className='text-xl text-orange-500' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Reclamações
                </h1>
                <p className='text-sm text-gray-500 mt-0.5'>
                  {reclamacoes.length} reclamações registradas
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-orange-50'>
                <FaComments className='text-base text-orange-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>
                  {reclamacoes.length}
                </p>
                <p className='text-xs text-gray-500'>Total</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 mb-6'>
            <div className='relative flex-1 max-w-md'>
              <FaSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
              <input
                type='text'
                placeholder='Buscar reclamações...'
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className='w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200'
              />
            </div>
          </div>

          {loading && (
            <div className='flex justify-center py-12'>
              <div className='flex flex-col items-center gap-3'>
                <div className='size-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                <p className='text-sm text-gray-500'>
                  Carregando Reclamações...
                </p>
              </div>
            </div>
          )}
          {!loading && erro && (
            <div className='bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center'>
              <p className='text-sm text-red-500'>{erro}</p>
            </div>
          )}
          {!loading && !erro && (
            <ReclamacoesList reclamacoes={reclamacoesFiltradas} />
          )}
        </main>
        {tipoCargo === 'MORADOR' && (
          <button
            className='fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-2xl flex items-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 z-50 group'
            onClick={handleNovaReclamacao}
          >
            <FaPlus className='text-sm group-hover:rotate-90 transition-transform duration-300' />
            <span className='text-sm'>Nova reclamação</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Reclamacoes;