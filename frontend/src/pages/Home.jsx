import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomSidebar from '../components/CustomSidebar';
import AvisoList from '../components/AvisoList';
import { buscarAvisos } from '../services/avisosService';
import { buscarReclamacoes } from '../services/reclamacoeService';
import { buscarReservas } from '../services/reservasService';
import { buscarEncomendas } from '../services/encomendasService';
import {
  FaBox,
  FaCalendarAlt,
  FaComments,
  FaBell,
  FaClock,
  FaUsers,
  FaArrowUp,
  FaArrowRight,
} from 'react-icons/fa';

function Home() {
  const [avisos, setAvisos] = useState([]);
  const [reclamacoes, setReclamacoes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setUser(userObject);
      } catch (e) {
        console.error('Erro ao parsear dados do usuario:', e);
      }
    }

    async function carregarDados() {
      try {
        const [dadosAvisos, dadosReclamacoes, dadosReservas, dadosEncomendas] =
          await Promise.allSettled([
            buscarAvisos(),
            buscarReclamacoes(),
            buscarReservas(),
            buscarEncomendas(),
          ]);
        
        const listaAvisos =
          dadosAvisos.status === 'fulfilled' ? dadosAvisos.value : [];
        setAvisos(Array.isArray(listaAvisos) ? listaAvisos : []);
        setReclamacoes(dadosReclamacoes.status === 'fulfilled' ? dadosReclamacoes.value : []);
        setReservas(dadosReservas.status === 'fulfilled' ? dadosReservas.value : []);
        setEncomendas(dadosEncomendas.status === 'fulfilled' ? dadosEncomendas.value : []);
      } catch (error) {
        setErro('Erro ao carregar dados.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const reclamacoesAbertas = useMemo(() => {
    if (!reclamacoes) return 0;
    
    return reclamacoes.filter(rec => {
      const statusFormatado = String(rec.status || '').trim().toUpperCase();
      return statusFormatado === 'ABERTA';
    }).length;
  }, [reclamacoes]);

  const reservasDoMes = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    return reservas.filter((r) => {
      if (!r.dataInicio) return false;
      const d = new Date(r.dataInicio);
      return d.getFullYear() === anoAtual && d.getMonth() === mesAtual;
    }).length;
  }, [reservas]);

  const encomendasPendentes = useMemo(() => encomendas.length, [encomendas]);

  const atividadesRecentes = useMemo(() => {
    const atividades = [];

    encomendas.slice(0, 2).forEach((enc) => {
      atividades.push({
        tipo: 'encomenda',
        titulo: 'Encomenda recebida',
        descricao: `${enc.remetente} - ${enc.morador}`,
        timestamp: enc.horaEntrega,
      });
    });

    reservas.slice(0, 1).forEach((res) => {
      const dataFormatada = res.dataInicio
        ? new Date(res.dataInicio).toLocaleDateString('pt-BR')
        : '';
      atividades.push({
        tipo: 'reserva',
        titulo: 'Reserva confirmada',
        descricao: `${res.status || 'Confirmada'} - ${dataFormatada}`,
        timestamp: dataFormatada,
      });
    });

    reclamacoes.slice(0, 1).forEach((rec) => {
      atividades.push({
        tipo: 'reclamacao',
        titulo: 'Reclamação registrada',
        descricao: (rec.titulo || rec.descricao || '').substring(0, 50), 
        timestamp: 'Recente',
      });
    });

    return atividades.slice(0, 3);
  }, [encomendas, reservas, reclamacoes]);

  const stats = [
    {
      label: 'Reclamacoes abertas',
      value: reclamacoesAbertas,
      icon: FaComments,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Reservas do mes',
      value: reservasDoMes,
      icon: FaCalendarAlt,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Encomendas pendentes',
      value: encomendasPendentes,
      icon: FaBox,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  const quickActions = [
    {
      title: 'Reclamacoes',
      description: 'Registre e acompanhe suas solicitacoes',
      icon: FaComments,
      href: '/reclamacoes',
      count: reclamacoesAbertas,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderHover: 'hover:border-orange-200',
    },
    {
      title: 'Reservas',
      description: 'Reserve espacos comuns do condominio',
      icon: FaCalendarAlt,
      href: '/reservas',
      count: reservasDoMes,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderHover: 'hover:border-emerald-200',
    },
    {
      title: 'Encomendas',
      description: 'Confira encomendas na portaria',
      icon: FaBox,
      href: '/encomendas',
      count: encomendasPendentes,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderHover: 'hover:border-indigo-200',
    },
  ];

  const activityIconMap = {
    encomenda: { icon: FaBox, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    reserva: { icon: FaCalendarAlt, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    reclamacao: { icon: FaComments, color: 'text-orange-500', bg: 'bg-orange-50' },
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <CustomSidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        <Navbar />

        <main className='flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
                Bem-vindo de volta
                {user?.nome ? `, ${user.nome.split(' ')[0]}` : ''}!
              </h1>
              <p className='text-sm text-gray-600 mt-1'>
                Acompanhe tudo sobre o Residencial Trindades
              </p>
            </div>
            <button className='self-start sm:self-auto inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200'>
              <FaBell className='text-gray-400' />
              <span className='hidden sm:inline'>Notificações</span>
              {avisos.length > 0 && (
                <span className='bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5'>
                  {avisos.length}
                </span>
              )}
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className='bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200'
              >
                <div className='flex items-center gap-3 mb-3'>
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${stat.bgColor}`}
                  >
                    <stat.icon className={`text-lg ${stat.color}`} />
                  </div>
                  <p className='text-sm text-gray-500 font-medium'>
                    {stat.label}
                  </p>
                </div>
                <p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className='grid gap-6 lg:grid-cols-3 mb-6'>
            <div className='lg:col-span-2'>
              <h2 className='text-base font-semibold text-gray-900 mb-4'>
                Acesso rápido
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.href}
                    className={`group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${action.borderHover} block`}
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div
                        className={`flex size-11 items-center justify-center rounded-xl ${action.bgColor}`}
                      >
                        <action.icon className={`text-lg ${action.color}`} />
                      </div>
                      {action.count > 0 && (
                        <span className='bg-gray-100 text-gray-700 text-xs font-semibold rounded-full px-2.5 py-0.5'>
                          {action.count}
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-1.5 mb-1'>
                      <h3 className='text-sm font-semibold text-gray-900'>
                        {action.title}
                      </h3>
                      <FaArrowRight className='text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-transform duration-200' />
                    </div>
                    <p className='text-xs text-gray-500 leading-relaxed'>
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-base font-semibold text-gray-900'>
                  Atividade recente
                </h2>
              </div>
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                {atividadesRecentes.length > 0 ? (
                  atividadesRecentes.map((atividade, index) => {
                    const iconData =
                      activityIconMap[atividade.tipo] ||
                      activityIconMap.encomenda;
                    const IconComponent = iconData.icon;
                    return (
                      <div key={index}>
                        <div className='flex items-start gap-3 px-4 py-4'>
                          <div
                            className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${iconData.bg}`}
                          >
                            <IconComponent
                              className={`text-sm ${iconData.color}`}
                            />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='text-sm font-medium text-gray-900'>
                              {atividade.titulo}
                            </p>
                            <p className='text-xs text-gray-500 truncate'>
                              {atividade.descricao}
                            </p>
                            <div className='mt-1.5 flex items-center gap-1 text-[11px] text-gray-400'>
                              <FaClock className='text-[9px]' />
                              <span>{atividade.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        {index < atividadesRecentes.length - 1 && (
                          <div className='mx-4 h-px bg-gray-100' />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className='flex flex-col items-center gap-2 py-10 text-center'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-gray-100'>
                      <FaClock className='text-gray-400' />
                    </div>
                    <p className='text-sm text-gray-500'>
                      Nenhuma atividade recente.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-base font-semibold text-gray-900 mb-4'>
              Avisos do condomínio
            </h2>
            {loading && (
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-3'>
                <div className='size-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                <p className='text-sm text-gray-500'>Carregando avisos...</p>
              </div>
            )}
            {!loading && erro && (
              <div className='bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center'>
                <p className='text-sm text-red-500'>{erro}</p>
              </div>
            )}
            {!loading && !erro && avisos.length === 0 && (
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-3 text-center'>
                <div className='flex size-12 items-center justify-center rounded-full bg-gray-100'>
                  <FaBell className='text-gray-400 text-lg' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Nenhum aviso recente
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    Quando houver novos avisos, eles aparecerão aqui.
                  </p>
                </div>
              </div>
            )}
            {!loading && !erro && avisos.length > 0 && (
              <AvisoList avisos={avisos} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
