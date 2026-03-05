import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import {
  buscarLocais,
  buscarReservas,
  publicarReserva,
} from '../../services/reservasService';
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaInfoCircle,
} from 'react-icons/fa';

const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function gerarDiasDoMes(ano, mes) {
  const ultimoDia = new Date(ano, mes + 1, 0);
  const dias = [];
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push(d);
  }
  return dias;
}

function Reservas() {
  const [locais, setLocais] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [filtroLocal, setFiltroLocal] = useState('');
  const [hoje] = useState(new Date());
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [idMorador, setIdMorador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setIdMorador(userObject.id);
      } catch (e) {
        console.error('Erro ao parsear dados do usuário:', e);
      }
    }
  }, []);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const [dadosLocais, dadosReservas] = await Promise.all([
          buscarLocais(),
          buscarReservas(),
        ]);
        setLocais(dadosLocais);
        setReservas(dadosReservas);
        setErro(null);
      } catch (error) {
        setErro('Erro ao carregar dados de reservas ou locais.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const localSelecionado = useMemo(
    () => locais.find((l) => l.id === Number(filtroLocal)),
    [locais, filtroLocal]
  );

  const reservasFiltradas = useMemo(() => {
    if (!filtroLocal) return [];
    return reservas.filter(
      (r) =>
        (r.local && (r.local.id === Number(filtroLocal) || r.local === Number(filtroLocal))) ||
        r.local_id === Number(filtroLocal)
    );
  }, [filtroLocal, reservas]);

  const datasReservadas = useMemo(
    () => reservasFiltradas.map((r) => r.data),
    [reservasFiltradas]
  );

  const diasDoMes = useMemo(
    () => gerarDiasDoMes(anoAtual, mesAtual),
    [anoAtual, mesAtual]
  );

  const isReservado = useCallback(
    (dia) => {
      const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      return datasReservadas.includes(dataStr);
    },
    [anoAtual, mesAtual, datasReservadas]
  );

  const isHoje = useCallback(
    (dia) =>
      dia === hoje.getDate() &&
      mesAtual === hoje.getMonth() &&
      anoAtual === hoje.getFullYear(),
    [hoje, mesAtual, anoAtual]
  );

  const isSelecionado = useCallback(
    (dia) => {
      if (!diaSelecionado) return false;
      return (
        diaSelecionado.dia === dia &&
        diaSelecionado.mes === mesAtual &&
        diaSelecionado.ano === anoAtual
      );
    },
    [diaSelecionado, mesAtual, anoAtual]
  );

  const prevMonth = useCallback(() => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((prev) => prev - 1);
    } else {
      setMesAtual((prev) => prev - 1);
    }
    setDiaSelecionado(null);
  }, [mesAtual]);

  const nextMonth = useCallback(() => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((prev) => prev + 1);
    } else {
      setMesAtual((prev) => prev + 1);
    }
    setDiaSelecionado(null);
  }, [mesAtual]);

  const adicionarReserva = useCallback(async () => {
    if (!filtroLocal || !diaSelecionado || !idMorador) {
      alert('Selecione um local, um dia e esteja logado como morador!');
      return;
    }
    const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(diaSelecionado.dia).padStart(2, '0')}`;
    const reservaData = {
      local: Number(filtroLocal),
      data: dataStr,
      morador: idMorador,
    };
    try {
      await publicarReserva(reservaData);
      const novasReservas = await buscarReservas();
      setReservas(novasReservas);
      setDiaSelecionado(null);
      alert('Reserva adicionada!');
    } catch (error) {
      alert('Erro ao adicionar reserva!');
    }
  }, [filtroLocal, diaSelecionado, idMorador, anoAtual, mesAtual]);

  useEffect(() => {
    setDiaSelecionado(null);
  }, [filtroLocal, mesAtual, anoAtual]);

  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();

  const reservasDoMes = useMemo(() => {
    return reservasFiltradas.filter((r) => {
      const d = new Date(r.data);
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    });
  }, [reservasFiltradas, mesAtual, anoAtual]);

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <div className='flex-1 overflow-auto bg-gray-50'>
          <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
            <div className='mb-6'>
              <div className='flex items-center gap-3 mb-1'>
                <div className='flex items-center justify-center size-10 rounded-xl bg-blue-500/10'>
                  <FaCalendarAlt className='text-blue-500' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    Reservas
                  </h1>
                  <p className='text-sm text-gray-500'>
                    Gerencie as reservas dos espaços do condomínio
                  </p>
                </div>
              </div>
            </div>

            {erro && (
              <div className='mb-6 bg-red-50 border border-red-100 rounded-xl p-4 text-center'>
                <p className='text-sm text-red-600'>{erro}</p>
              </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
              <div className='bg-white rounded-2xl border border-gray-100 p-5 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center size-10 rounded-xl bg-blue-50'>
                    <FaMapMarkerAlt className='text-blue-500 text-sm' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {locais.length}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Espaços disponíveis
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-2xl border border-gray-100 p-5 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center size-10 rounded-xl bg-emerald-50'>
                    <FaCheckCircle className='text-emerald-500 text-sm' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {reservas.length}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Total de reservas
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-2xl border border-gray-100 p-5 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center size-10 rounded-xl bg-amber-50'>
                    <FaClock className='text-amber-500 text-sm' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {filtroLocal ? reservasDoMes.length : 0}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Reservas este mês
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2 space-y-6'>
                <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
                  <label
                    className='block text-sm font-semibold text-gray-700 mb-3'
                    htmlFor='filtroLocal'
                  >
                    Selecione o espaço
                  </label>
                  {loading ? (
                    <div className='h-11 bg-gray-100 rounded-xl animate-pulse' />
                  ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                      {locais.map((local) => {
                        const isActive = filtroLocal === String(local.id);
                        return (
                          <button
                            key={local.id}
                            onClick={() =>
                              setFiltroLocal(isActive ? '' : String(local.id))
                            }
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                              isActive
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center size-10 rounded-xl transition-colors ${
                                isActive
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-400'
                              }`}
                            >
                              <FaMapMarkerAlt className='text-sm' />
                            </div>
                            <span
                              className={`text-xs font-semibold text-center leading-tight ${
                                isActive ? 'text-blue-700' : 'text-gray-600'
                              }`}
                            >
                              {local.nome}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {filtroLocal && (
                  <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
                    <div className='flex items-center justify-between mb-6'>
                      <button
                        onClick={prevMonth}
                        className='flex items-center justify-center size-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all'
                      >
                        <FaChevronLeft className='text-xs' />
                      </button>
                      <h3 className='text-lg font-bold text-gray-900'>
                        {NOMES_MESES[mesAtual]} {anoAtual}
                      </h3>
                      <button
                        onClick={nextMonth}
                        className='flex items-center justify-center size-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all'
                      >
                        <FaChevronRight className='text-xs' />
                      </button>
                    </div>

                    <div className='grid grid-cols-7 gap-1 mb-2'>
                      {DIAS_SEMANA.map((dia, idx) => (
                        <div
                          key={idx}
                          className='text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400 py-2'
                        >
                          {dia}
                        </div>
                      ))}
                    </div>

                    <div className='grid grid-cols-7 gap-1'>
                      {Array(primeiroDiaSemana)
                        .fill(null)
                        .map((_, idx) => (
                          <div
                            key={`empty-${idx}`}
                            className='aspect-square'
                          />
                        ))}
                      {diasDoMes.map((dia) => {
                        const reservado = isReservado(dia);
                        const selecionado = isSelecionado(dia);
                        const ehHoje = isHoje(dia);
                        return (
                          <button
                            key={dia}
                            className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 relative ${
                              reservado
                                ? 'bg-blue-500 text-white cursor-not-allowed shadow-sm'
                                : selecionado
                                  ? 'bg-emerald-500 text-white scale-105 shadow-md shadow-emerald-500/25'
                                  : ehHoje
                                    ? 'bg-blue-50 text-blue-600 font-bold ring-2 ring-blue-200'
                                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                            disabled={reservado}
                            onClick={() =>
                              setDiaSelecionado({
                                dia,
                                mes: mesAtual,
                                ano: anoAtual,
                              })
                            }
                          >
                            {dia}
                          </button>
                        );
                      })}
                    </div>

                    <div className='flex flex-wrap items-center justify-center gap-5 mt-6 pt-5 border-t border-gray-100'>
                      <span className='flex items-center gap-2 text-xs text-gray-500'>
                        <span className='inline-block size-3 bg-blue-500 rounded-md' />
                        Reservado
                      </span>
                      <span className='flex items-center gap-2 text-xs text-gray-500'>
                        <span className='inline-block size-3 bg-emerald-500 rounded-md' />
                        Selecionado
                      </span>
                      <span className='flex items-center gap-2 text-xs text-gray-500'>
                        <span className='inline-block size-3 bg-blue-50 rounded-md ring-2 ring-blue-200' />
                        Hoje
                      </span>
                    </div>

                    {diaSelecionado && (
                      <button
                        className='mt-6 w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200'
                        onClick={adicionarReserva}
                      >
                        <FaPlus className='text-xs' />
                        Confirmar reserva para dia {diaSelecionado.dia}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className='space-y-6'>
                {localSelecionado ? (
                  <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-4'>
                      <div className='flex items-center justify-center size-10 rounded-xl bg-blue-500'>
                        <FaMapMarkerAlt className='text-white text-sm' />
                      </div>
                      <div>
                        <h3 className='text-sm font-bold text-gray-900'>
                          {localSelecionado.nome}
                        </h3>
                        <p className='text-xs text-gray-500'>
                          {reservasDoMes.length} reserva(s) em{' '}
                          {NOMES_MESES[mesAtual]}
                        </p>
                      </div>
                    </div>
                    <div className='h-px bg-gray-100 mb-4' />
                    <div className='space-y-3'>
                      {reservasDoMes.length > 0 ? (
                        reservasDoMes.slice(0, 5).map((r, idx) => {
                          const data = new Date(r.data);
                          const morador = r.morador;
                          return (
                            <div
                              key={idx}
                              className='flex items-center gap-3 p-3 rounded-xl bg-gray-50'
                            >
                              <div className='flex flex-col items-center justify-center size-11 rounded-xl bg-white border border-gray-100'>
                                <span className='text-sm font-bold text-gray-900 leading-none'>
                                  {data.getDate()}
                                </span>
                                <span className='text-[9px] text-gray-400 uppercase font-semibold'>
                                  {NOMES_MESES[data.getMonth()].slice(0, 3)}
                                </span>
                              </div>
                              <div className='flex-1 min-w-0'>
                                <p className='text-xs font-semibold text-gray-700 truncate'>
                                  {morador?.nome || 'Morador'}
                                </p>
                                <p className='text-[10px] text-gray-400'>
                                  Reserva confirmada
                                </p>
                              </div>
                              <div className='flex items-center justify-center size-6 rounded-full bg-emerald-50'>
                                <FaCheckCircle className='text-emerald-500 text-[10px]' />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className='text-center py-4'>
                          <p className='text-xs text-gray-400'>
                            Sem reservas neste mês
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
                    <div className='text-center py-6'>
                      <div className='flex items-center justify-center size-14 rounded-2xl bg-blue-50 mx-auto mb-4'>
                        <FaCalendarAlt className='text-blue-400 text-xl' />
                      </div>
                      <h3 className='text-sm font-bold text-gray-900 mb-1'>
                        Selecione um espaço
                      </h3>
                      <p className='text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto'>
                        Escolha um dos espaços acima para ver o calendário de
                        disponibilidade
                      </p>
                    </div>
                  </div>
                )}

                <div className='bg-blue-50/50 rounded-2xl border border-blue-100 p-5'>
                  <div className='flex items-start gap-3'>
                    <div className='flex items-center justify-center size-8 rounded-lg bg-blue-100 shrink-0 mt-0.5'>
                      <FaInfoCircle className='text-blue-500 text-xs' />
                    </div>
                    <div>
                      <h4 className='text-xs font-bold text-blue-900 mb-1.5'>
                        Como reservar?
                      </h4>
                      <ol className='space-y-1.5 text-[11px] text-blue-700/70 leading-relaxed'>
                        <li>1. Selecione o espaço desejado</li>
                        <li>2. Escolha uma data disponível no calendário</li>
                        <li>3. Clique em confirmar reserva</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservas;
