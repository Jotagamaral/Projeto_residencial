import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import {
  buscarLocais,
  buscarReservas,
  publicarReserva,
} from '../../services/reservasService';

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
        console.error('Erro ao parsear dados do usuário do localStorage:', e);
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
      } catch (error) {
        setErro('Erro ao carregar dados de reservas ou locais.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const reservasFiltradas = useMemo(() => {
    if (!filtroLocal) return [];
    return reservas.filter(
      (r) =>
        (r.local &&
          (r.local.id === Number(filtroLocal) ||
            r.local === Number(filtroLocal))) ||
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

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <div className='px-4 mt-6'>
          <div className='flex items-center justify-center bg-blue-600 text-white text-xl font-semibold rounded-2xl shadow-md h-[120px] transition-all duration-300'>
            Reservas
          </div>
        </div>
        <div className='flex justify-center mt-6 px-4'>
          <div className='bg-white shadow-md rounded-2xl px-8 pt-6 pb-8 w-full max-w-lg'>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='filtroLocal'
              >
                Filtrar por local:
              </label>
              <select
                id='filtroLocal'
                className='shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filtroLocal}
                onChange={(e) => setFiltroLocal(e.target.value)}
              >
                <option value=''>Selecione um local</option>
                {locais.map((local) => (
                  <option key={local.id} value={local.id}>
                    {local.nome}
                  </option>
                ))}
              </select>
            </div>
            {filtroLocal && (
              <>
                <div className='flex items-center justify-between w-full mb-4'>
                  <button
                    onClick={prevMonth}
                    className='px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-bold transition-all duration-200'
                  >
                    &lt;
                  </button>
                  <span className='font-bold text-gray-700 text-lg'>
                    {NOMES_MESES[mesAtual]} {anoAtual}
                  </span>
                  <button
                    onClick={nextMonth}
                    className='px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-bold transition-all duration-200'
                  >
                    &gt;
                  </button>
                </div>
                <div className='grid grid-cols-7 gap-2 w-full mb-4'>
                  {DIAS_SEMANA.map((dia, idx) => (
                    <div
                      key={idx}
                      className='text-center font-semibold text-gray-500 text-sm'
                    >
                      {dia}
                    </div>
                  ))}
                  {Array(new Date(anoAtual, mesAtual, 1).getDay())
                    .fill(null)
                    .map((_, idx) => (
                      <div key={`empty-${idx}`} />
                    ))}
                  {diasDoMes.map((dia) => {
                    const reservado = isReservado(dia);
                    const selecionado = isSelecionado(dia);
                    return (
                      <button
                        key={dia}
                        className={`text-center py-2 rounded-full transition-all duration-200 font-medium ${
                          reservado
                            ? 'bg-blue-500 text-white cursor-not-allowed'
                            : selecionado
                              ? 'bg-green-500 text-white scale-110 shadow-md'
                              : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
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
                <div className='flex items-center justify-center gap-6 mt-2 text-sm text-gray-600'>
                  <span className='flex items-center gap-1.5'>
                    <span className='inline-block w-3 h-3 bg-blue-500 rounded-full' />
                    Reservado
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <span className='inline-block w-3 h-3 bg-green-500 rounded-full' />
                    Selecionado
                  </span>
                </div>
                {diaSelecionado && (
                  <button
                    className='mt-6 w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-lg shadow-md transition-all duration-300'
                    onClick={adicionarReserva}
                  >
                    + Nova Reserva
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservas;
