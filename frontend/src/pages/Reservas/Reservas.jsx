import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { buscarLocais, buscarReservas, publicarReserva } from '../../services/reservasService';

// Função para gerar os dias do mês atual
function gerarDiasDoMes(ano, mes) {
  const dias = [];
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
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
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const [dadosLocais, dadosReservas] = await Promise.all([
          buscarLocais(),
          buscarReservas()
        ]);
        setLocais(dadosLocais);
        setReservas(dadosReservas);
      } catch (error) {
        setErro("Erro ao carregar dados de reservas ou locais.");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Filtra reservas pelo local selecionado
  const reservasFiltradas = filtroLocal
  ? reservas.filter(r =>
      // Se vier como local (objeto) ou local_id (número)
      (r.local && (r.local.id === Number(filtroLocal) || r.local === Number(filtroLocal))) ||
      r.local_id === Number(filtroLocal)
    )
  : [];

  // Pega as datas reservadas para o local filtrado
  const datasReservadas = reservasFiltradas.map(r => r.data);

  // Gera os dias do mês atual
  const diasDoMes = gerarDiasDoMes(anoAtual, mesAtual);

  // Função para verificar se o dia está reservado
  function isReservado(dia) {
    const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return datasReservadas.includes(dataStr);
  }

  // Função para verificar se o dia está selecionado
  function isSelecionado(dia) {
    if (!diaSelecionado) return false;
    return (
      diaSelecionado.dia === dia &&
      diaSelecionado.mes === mesAtual &&
      diaSelecionado.ano === anoAtual
    );
  }

  // Navegação de mês
  function prevMonth() {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
    setDiaSelecionado(null);
  }
  function nextMonth() {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
    setDiaSelecionado(null);
  }

  // Nomes dos meses para exibição
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Lógica para adicionar nova reserva (POST real)
  async function adicionarReserva() {
    if (!filtroLocal || !diaSelecionado || !idMorador) {
      alert("Selecione um local, um dia e esteja logado como morador!");
      return;
    }
    const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(diaSelecionado.dia).padStart(2, '0')}`;
    const reservaData = {
      local: Number(filtroLocal),
      data: dataStr,
      morador: idMorador // agora vem do localStorage
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
  }

  // Quando trocar o filtro, limpa seleção de dia
  useEffect(() => {
    setDiaSelecionado(null);
  }, [filtroLocal, mesAtual, anoAtual]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CustomSidebar />
      <div className="w-full">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-8 w-full">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md flex flex-col">
            <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
              Reservas por Local
            </h2>
            {/* Filtro de local */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filtroLocal">
                Filtrar por local:
              </label>
              <select
                id="filtroLocal"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={filtroLocal}
                onChange={e => setFiltroLocal(e.target.value)}
              >
                <option value="">Selecione um local</option>
                {locais.map(local => (
                  <option key={local.id} value={local.id}>{local.nome}</option>
                ))}
              </select>
            </div>
            {/* Calendário customizado */}
            {filtroLocal && (
              <>
                <div className="flex items-center justify-between w-full mb-2">
                  <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">&lt;</button>
                  <span className="font-bold">{nomesMeses[mesAtual]} {anoAtual}</span>
                  <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2 w-full mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, idx) => (
                    <div key={idx} className="text-center font-semibold text-gray-600">{dia}</div>
                  ))}
                  {/* Espaço para o primeiro dia da semana */}
                  {Array(new Date(anoAtual, mesAtual, 1).getDay()).fill(null).map((_, idx) => (
                    <div key={`empty-${idx}`}></div>
                  ))}
                  {diasDoMes.map(dia => {
                    const reservado = isReservado(dia);
                    const selecionado = isSelecionado(dia);
                    return (
                      <button
                        key={dia}
                        className={
                          `text-center py-2 rounded-full transition-all duration-150 border 
                          ${reservado ? 'bg-blue-400 text-white border-blue-600 cursor-not-allowed' : 
                            selecionado ? 'bg-green-500 text-white border-green-700 font-bold scale-110' : 
                            'bg-gray-100 hover:bg-green-200 border-gray-300 text-gray-800'}`
                        }
                        disabled={reservado}
                        onClick={() => setDiaSelecionado({ dia, mes: mesAtual, ano: anoAtual })}
                      >
                        {dia}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>
                    <span className="inline-block w-4 h-4 bg-blue-400 rounded-full mr-1 border border-blue-600"></span>
                    Reservado
                  </span>
                  <span>
                    <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-1 border border-green-700"></span>
                    Selecionado
                  </span>
                </div>
                {/* Botão de adicionar nova reserva */}
                {diaSelecionado && (
                  <button
                    className="mt-4 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-2xl shadow transition-all duration-150"
                    onClick={adicionarReserva}
                  >
                    <span className="mr-2">+</span> Nova Reserva
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