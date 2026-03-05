import { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { buscarEncomendas } from '../../services/encomendasService';
import { useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaPlus,
  FaSearch,
  FaUser,
  FaClock,
  FaCalendarDay,
  FaTimes,
  FaFilter,
} from 'react-icons/fa';

function EncomendasList({ encomendas }) {
  if (!encomendas || encomendas.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='flex size-16 items-center justify-center rounded-full bg-blue-50 mb-4'>
          <FaBox className='text-2xl text-blue-300' />
        </div>
        <p className='text-base font-medium text-gray-900'>
          Nenhuma encomenda encontrada
        </p>
        <p className='mt-1 text-sm text-gray-500'>
          Quando houver encomendas, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {encomendas.map((item) => (
        <div
          key={item.id}
          className='group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden'
        >
          <div className='flex items-center gap-3 px-5 pt-5 pb-3'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50'>
              <FaBox className='text-sm text-blue-500' />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-semibold text-gray-900 truncate'>
                {item.remetente}
              </p>
              {item.horaEntrega && (
                <div className='flex items-center gap-1 mt-0.5'>
                  <FaClock className='text-[9px] text-gray-400' />
                  <span className='text-[11px] text-gray-400'>
                    {item.horaEntrega}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='px-5 pb-4 space-y-2'>
            <div className='flex items-center gap-2'>
              <FaUser className='text-[10px] text-gray-400 shrink-0' />
              <p className='text-sm text-gray-600 truncate'>{item.morador}</p>
            </div>
            {item.apartamento && (
              <p className='text-sm text-gray-600'>Apt. {item.apartamento}</p>
            )}
          </div>

          <div className='h-1 w-full bg-blue-500/0 group-hover:bg-blue-500 transition-all duration-300' />
        </div>
      ))}
    </div>
  );
}

function Encomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [tipoCargo, setTipoCargo] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const navigate = useNavigate();

  const hoje = useMemo(() => new Date().toISOString().slice(0, 10), []);

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

    async function carregarEncomendas() {
      try {
        const dados = await buscarEncomendas();
        setEncomendas(dados);
      } catch (error) {
        setErro('Erro ao carregar encomendas.');
      } finally {
        setLoading(false);
      }
    }
    carregarEncomendas();
  }, []);

  const dataReferencia = useMemo(
    () => (filtroData || hoje),
    [filtroData, hoje]
  );

  const encomendasFiltradas = useMemo(() => {
    return encomendas.filter((enc) => {
      const matchData = filtroData
        ? enc.horaEntrega?.slice(0, 10) === filtroData
        : true;
      const matchBusca =
        !busca ||
        enc.remetente?.toLowerCase().includes(busca.toLowerCase()) ||
        enc.morador?.toLowerCase().includes(busca.toLowerCase());
      return matchData && matchBusca;
    });
  }, [encomendas, filtroData, busca]);

  const totalNaData = useMemo(() => {
    return encomendas.filter(
      (enc) => enc.horaEntrega?.slice(0, 10) === dataReferencia
    ).length;
  }, [encomendas, dataReferencia]);

  const handleNovaEncomenda = useCallback(() => {
    navigate('/cadastro_encomendas');
  }, [navigate]);

  const handleLimparFiltros = useCallback(() => {
    setBusca('');
    setFiltroData('');
  }, []);

  const temFiltro = busca || filtroData;

  const labelData = useMemo(() => {
    if (!filtroData) return 'Recebidas hoje';
    if (filtroData === hoje) return 'Recebidas hoje';
    return `Recebidas em ${new Date(filtroData + 'T00:00:00').toLocaleDateString('pt-BR')}`;
  }, [filtroData, hoje]);

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <main className='flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <div className='flex size-12 items-center justify-center rounded-2xl bg-blue-50'>
                <FaBox className='text-xl text-blue-500' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Encomendas
                </h1>
                <p className='text-sm text-gray-500 mt-0.5'>
                  {encomendas.length} encomenda(s) registrada(s)
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-blue-50'>
                <FaBox className='text-base text-blue-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>
                  {filtroData ? encomendasFiltradas.length : encomendas.length}
                </p>
                <p className='text-xs text-gray-500'>
                  {filtroData ? 'Encontradas no filtro' : 'Total'}
                </p>
              </div>
            </div>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-emerald-50'>
                <FaCalendarDay className='text-base text-emerald-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>
                  {totalNaData}
                </p>
                <p className='text-xs text-gray-500'>{labelData}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <div className='flex size-7 items-center justify-center rounded-lg bg-blue-50'>
                  <FaFilter className='text-[10px] text-blue-500' />
                </div>
                <span className='text-sm font-semibold text-gray-700'>
                  Filtros
                </span>
              </div>
              {temFiltro && (
                <button
                  onClick={handleLimparFiltros}
                  className='flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors duration-200'
                >
                  <FaTimes className='text-[10px]' />
                  Limpar filtros
                </button>
              )}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'>
                  Buscar
                </label>
                <div className='relative'>
                  <FaSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                  <input
                    type='text'
                    placeholder='Remetente ou destinatário...'
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'>
                  Data de recebimento
                </label>
                <div className='relative'>
                  <FaCalendarDay className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none' />
                  <input
                    type='date'
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 ${
                      filtroData
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                        : 'bg-gray-50 border-gray-200 text-gray-700 focus:bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className='flex justify-center py-12'>
              <div className='flex flex-col items-center gap-3'>
                <div className='size-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                <p className='text-sm text-gray-500'>
                  Carregando encomendas...
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
            <EncomendasList encomendas={encomendasFiltradas} />
          )}
        </main>
        {tipoCargo === 'FUNCIONARIO' && (
          <button
            className='fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-2xl flex items-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 z-50 group'
            onClick={handleNovaEncomenda}
          >
            <FaPlus className='text-sm group-hover:rotate-90 transition-transform duration-300' />
            <span className='text-sm'>Nova encomenda</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Encomendas;
