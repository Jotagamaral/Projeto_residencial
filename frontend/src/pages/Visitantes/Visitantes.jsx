import { useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import {
  listarVisitantes,
  inativarVisitante,
  registrarEntradaVisitante,
  registrarAcessoVisitanteExistente,
  atualizarVisitante,
} from '../../services/visitantesService';
import { buscarMoradores } from '../../services/moradoresService';
import { alertErro, confirmarAcao } from '../../utils/swal';
import {
  FaPlus, FaSearch, FaUsers, FaSignOutAlt, FaTimes, FaPaperPlane,
  FaUserPlus, FaUserCheck, FaHome, FaUserTie, FaExclamationTriangle,
} from 'react-icons/fa';

const FORM_VAZIO = { cpf: '', rg: '', nome: '', telefone: '' };

function mascaraCpf(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraRg(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 7);
  return d
    .replace(/(\d{1})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2');
}

function mascaraTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function apenasDigitos(valor) {
  return valor.replace(/\D/g, '');
}

function obterUsuarioLogado() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Visitantes() {
  const usuarioLogado = useMemo(() => obterUsuarioLogado(), []);
  const idFuncionarioLogado = usuarioLogado?.funcionarioId;
  const nomeFuncionarioLogado = usuarioLogado?.nome || 'Usuário';

  const [visitantes, setVisitantes] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroVisitantes, setErroVisitantes] = useState(null);
  const [erroMoradores, setErroMoradores] = useState(null);
  const [busca, setBusca] = useState('');
  const [inativandoId, setInativandoId] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('ativos');

  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState('novo');
  const [buscaVisitante, setBuscaVisitante] = useState('');
  const [buscaMorador, setBuscaMorador] = useState('');
  const [visitanteSelecionado, setVisitanteSelecionado] = useState(null);
  const [moradorSelecionado, setMoradorSelecionado] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);
  const [erroSubmit, setErroSubmit] = useState(null);

  const carregar = async () => {
    setCarregando(true);
    setErroVisitantes(null);
    setErroMoradores(null);

    try {
      const v = await listarVisitantes();
      console.log('[Visitantes] visitantes recebidos:', v);
      setVisitantes(Array.isArray(v) ? v : []);
    } catch (err) {
      console.error('[Visitantes] erro ao listar visitantes:', err);
      setErroVisitantes(err.message || 'Falha ao carregar visitantes');
      setVisitantes([]);
    }

    try {
      const m = await buscarMoradores();
      console.log('[Visitantes] moradores recebidos:', m);
      setMoradores(Array.isArray(m) ? m : []);
    } catch (err) {
      console.error('[Visitantes] erro ao buscar moradores:', err);
      setErroMoradores(err.message || 'Falha ao carregar moradores');
      setMoradores([]);
    }

    setCarregando(false);
  };

  useEffect(() => { carregar(); }, []);

  const resetarModal = () => {
    setModoModal('novo');
    setVisitanteSelecionado(null);
    setMoradorSelecionado(null);
    setBuscaVisitante('');
    setBuscaMorador('');
    setForm(FORM_VAZIO);
    setErroSubmit(null);
  };

  const abrirModal = () => { resetarModal(); setModalAberto(true); };
  const fecharModal = () => { setModalAberto(false); resetarModal(); };

  const abrirModalReinserir = (v) => {
    resetarModal();
    setModoModal('existente');
    selecionarVisitanteExistente(v);
    setModalAberto(true);
  };

  const trocarModo = (modo) => {
    setModoModal(modo);
    setVisitanteSelecionado(null);
    setBuscaVisitante('');
    setForm(FORM_VAZIO);
    setErroSubmit(null);
  };

  const selecionarVisitanteExistente = (v) => {
    setVisitanteSelecionado(v);
    setForm({
      cpf: mascaraCpf(v.cpf || ''),
      rg: mascaraRg(v.rg || ''),
      nome: v.nome || '',
      telefone: mascaraTelefone(v.telefone || ''),
    });
  };

  const visitantesFiltradosModal = useMemo(() => {
    if (!buscaVisitante) return visitantes;
    const t = buscaVisitante.toLowerCase();
    return visitantes.filter(v =>
      v.nome?.toLowerCase().includes(t) ||
      v.cpf?.includes(t) ||
      v.rg?.toLowerCase().includes(t)
    );
  }, [visitantes, buscaVisitante]);

  const moradoresFiltrados = useMemo(() => {
    if (!buscaMorador) return moradores;
    const t = buscaMorador.toLowerCase();
    return moradores.filter(m =>
      m.nome?.toLowerCase().includes(t) ||
      String(m.apartamento || '').includes(t) ||
      m.bloco?.toLowerCase().includes(t)
    );
  }, [moradores, buscaMorador]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroSubmit(null);

    if (!idFuncionarioLogado) {
      setErroSubmit('Usuário logado não está vinculado a um funcionário.');
      return;
    }
    if (!moradorSelecionado) {
      setErroSubmit('Selecione o morador visitado');
      return;
    }

    setSalvando(true);
    try {
      if (modoModal === 'novo') {
        if (!form.cpf || !form.rg || !form.nome) {
          setErroSubmit('Preencha nome, CPF e RG');
          setSalvando(false);
          return;
        }
        if (apenasDigitos(form.cpf).length !== 11) {
          setErroSubmit('O CPF deve ter 11 dígitos');
          setSalvando(false);
          return;
        }

        const payload = {
          cpf: apenasDigitos(form.cpf),
          rg: apenasDigitos(form.rg),
          nome: form.nome,
          telefone: form.telefone ? apenasDigitos(form.telefone) : null,
          idMorador: Number(moradorSelecionado.id),
          idFuncionario: Number(idFuncionarioLogado),
        };
        console.log('[Visitantes] POST entrada payload:', payload);
        await registrarEntradaVisitante(payload);
      } else {
        if (!visitanteSelecionado) {
          setErroSubmit('Selecione um visitante da lista');
          setSalvando(false);
          return;
        }

        const houveAlteracao =
          form.nome !== (visitanteSelecionado.nome || '') ||
          apenasDigitos(form.cpf) !== (visitanteSelecionado.cpf || '') ||
          apenasDigitos(form.rg) !== (visitanteSelecionado.rg || '') ||
          apenasDigitos(form.telefone) !== (visitanteSelecionado.telefone || '');

        if (houveAlteracao) {
          await atualizarVisitante(visitanteSelecionado.id, {
            nome: form.nome,
            cpf: form.cpf ? apenasDigitos(form.cpf) : null,
            rg: apenasDigitos(form.rg),
            telefone: form.telefone ? apenasDigitos(form.telefone) : null,
          });
        }

        await registrarAcessoVisitanteExistente(visitanteSelecionado.id, {
          idMorador: Number(moradorSelecionado.id),
          idFuncionario: Number(idFuncionarioLogado),
        });
      }
      fecharModal();
      await carregar();
    } catch (erro) {
      console.error('[Visitantes] erro no submit:', erro);
      setErroSubmit(erro.message || 'Erro ao registrar entrada');
    } finally {
      setSalvando(false);
    }
  };

  const handleInativar = async (id, nome) => {
    if (!await confirmarAcao('Registrar Saída', `Confirma a saída de ${nome} do prédio?`)) return;
    setInativandoId(id);
    try {
      await inativarVisitante(id);
      await carregar();
    } catch (erro) {
      await alertErro('Erro ao registrar saída', erro.message);
    } finally {
      setInativandoId(null);
    }
  };

  const visitantesFiltrados = visitantes.filter((v) => {
    if (abaAtiva === 'ativos' && !v.ativo) return false;
    if (abaAtiva === 'inativos' && v.ativo) return false;
    const termo = busca.toLowerCase();
    return (
      v.nome?.toLowerCase().includes(termo) ||
      v.cpf?.includes(termo) ||
      v.rg?.toLowerCase().includes(termo)
    );
  });

  const totalAtivos = visitantes.filter((v) => v.ativo).length;
  const totalInativos = visitantes.filter((v) => !v.ativo).length;

  const podeMostrarFormulario = modoModal === 'novo' || visitanteSelecionado;

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      <CustomSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Navbar />
        <div className='flex-1 overflow-auto'>
          <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>

            <div className='flex items-center justify-between mb-6'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Visitantes</h1>
                <p className='mt-1 text-sm text-gray-600'>Listagem de visitantes cadastrados</p>
              </div>
              <button onClick={abrirModal}
                className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
                <FaPlus className='text-sm' />
                Registrar Entrada
              </button>
            </div>

            {erroVisitantes && (
              <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
                <FaExclamationTriangle className='text-red-500 mt-0.5 shrink-0' />
                <div className='flex-1'>
                  <p className='text-sm font-semibold text-red-900'>Erro ao carregar visitantes</p>
                  <p className='text-xs text-red-700 mt-1'>{erroVisitantes}</p>
                </div>
                <button onClick={carregar} className='text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-semibold'>
                  Tentar novamente
                </button>
              </div>
            )}

            {erroMoradores && (
              <div className='mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3'>
                <FaExclamationTriangle className='text-amber-500 mt-0.5 shrink-0' />
                <div className='flex-1'>
                  <p className='text-sm font-semibold text-amber-900'>Erro ao carregar moradores</p>
                  <p className='text-xs text-amber-700 mt-1'>{erroMoradores}</p>
                </div>
              </div>
            )}

            <div className='flex gap-2 p-1 bg-gray-100 rounded-lg mb-4 max-w-md'>
              <button onClick={() => setAbaAtiva('ativos')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${abaAtiva === 'ativos' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                Ativos ({totalAtivos})
              </button>
              <button onClick={() => setAbaAtiva('inativos')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${abaAtiva === 'inativos' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                Inativos ({totalInativos})
              </button>
            </div>

            <div className='relative mb-4'>
              <FaSearch className='absolute left-3 top-3.5 text-gray-400' />
              <input type='text' placeholder='Buscar por nome, CPF ou RG...'
                value={busca} onChange={(e) => setBusca(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white' />
            </div>

            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
              {carregando ? (
                <div className='flex items-center justify-center py-16'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                </div>
              ) : visitantesFiltrados.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                  <div className='flex size-16 items-center justify-center rounded-full bg-blue-50 mb-4'>
                    <FaUsers className='text-2xl text-blue-300' />
                  </div>
                  <p className='text-base font-medium text-gray-900'>
                    {visitantes.length === 0 ? 'Nenhum visitante cadastrado' : 'Nenhum visitante encontrado'}
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>Total na base: {visitantes.length}</p>
                </div>
              ) : (
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-gray-100 bg-gray-50'>
                      <th className='text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Nome</th>
                      <th className='text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider'>CPF</th>
                      <th className='text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider'>RG</th>
                      <th className='text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Telefone</th>
                      <th className='text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
                      <th className='px-6 py-3'></th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {visitantesFiltrados.map((v) => (
                      <tr key={v.id} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4 font-medium text-gray-900'>{v.nome}</td>
                        <td className='px-6 py-4 text-gray-600'>{v.cpf || '—'}</td>
                        <td className='px-6 py-4 text-gray-600'>{v.rg}</td>
                        <td className='px-6 py-4 text-gray-600'>{v.telefone || '—'}</td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${v.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {v.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-right'>
                          {v.ativo ? (
                            <button onClick={() => handleInativar(v.id, v.nome)} disabled={inativandoId === v.id}
                              className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 text-xs font-semibold rounded-lg transition-colors'>
                              <FaSignOutAlt className='text-xs' />
                              {inativandoId === v.id ? 'Saindo...' : 'Registrar Saída'}
                            </button>
                          ) : (
                            <button onClick={() => abrirModalReinserir(v)}
                              className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors'>
                              <FaUserCheck className='text-xs' />
                              Registrar Entrada
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>

      {modalAberto && (
        <div className='fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto'>
            <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10'>
              <h2 className='text-xl font-bold text-gray-900'>Registrar Entrada</h2>
              <button onClick={fecharModal} className='text-gray-400 hover:text-gray-600'>
                <FaTimes className='text-xl' />
              </button>
            </div>

            <div className='px-6 pt-4'>
              <div className='flex gap-2 p-1 bg-gray-100 rounded-lg'>
                <button type='button' onClick={() => trocarModo('novo')}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${modoModal === 'novo' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  <FaUserPlus />
                  Novo Visitante
                </button>
                <button type='button' onClick={() => trocarModo('existente')}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${modoModal === 'existente' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  <FaUserCheck />
                  Existente
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-4'>

              {erroSubmit && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2'>
                  <FaExclamationTriangle className='text-red-500 mt-0.5 shrink-0 text-sm' />
                  <p className='text-sm text-red-700'>{erroSubmit}</p>
                </div>
              )}

              {modoModal === 'existente' && !visitanteSelecionado && (
                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-2'>Pesquisar visitante</label>
                  <div className='relative mb-2'>
                    <FaSearch className='absolute left-3 top-3 text-gray-400 text-sm' />
                    <input type='text' placeholder='Nome, CPF ou RG...' value={buscaVisitante}
                      onChange={(e) => setBuscaVisitante(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' />
                  </div>
                  <div className='max-h-48 overflow-auto border border-gray-200 rounded-lg divide-y divide-gray-100'>
                    {visitantesFiltradosModal.length === 0 ? (
                      <p className='p-4 text-center text-sm text-gray-500'>
                        {visitantes.length === 0 ? 'Nenhum visitante cadastrado' : 'Nenhum encontrado'}
                      </p>
                    ) : (
                      visitantesFiltradosModal.map((v) => (
                        <button key={v.id} type='button' onClick={() => selecionarVisitanteExistente(v)}
                          className='w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors'>
                          <p className='text-sm font-semibold text-gray-900'>{v.nome}</p>
                          <p className='text-xs text-gray-500'>CPF: {v.cpf || '—'} · RG: {v.rg}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {modoModal === 'existente' && visitanteSelecionado && (
                <div className='flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                  <div>
                    <p className='text-sm font-semibold text-blue-900'>{visitanteSelecionado.nome}</p>
                    <p className='text-xs text-blue-600'>CPF: {visitanteSelecionado.cpf || '—'} · RG: {visitanteSelecionado.rg}</p>
                  </div>
                  <button type='button' onClick={() => { setVisitanteSelecionado(null); setForm(FORM_VAZIO); }}
                    className='text-blue-400 hover:text-blue-600 text-sm font-semibold'>Trocar</button>
                </div>
              )}

              {podeMostrarFormulario && (
                <>
                  {modoModal === 'existente' && (
                    <p className='text-xs text-gray-500 -mb-2'>Edite os dados do visitante se necessário.</p>
                  )}

                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>Nome *</label>
                    <input type='text' placeholder='João Silva' value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' required />
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>CPF {modoModal === 'novo' && '*'}</label>
                      <input type='text' maxLength='14' placeholder='000.000.000-00' value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: mascaraCpf(e.target.value) })}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                        required={modoModal === 'novo'} />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>RG *</label>
                      <input type='text' maxLength='9' placeholder='0.000.000' value={form.rg}
                        onChange={(e) => setForm({ ...form, rg: mascaraRg(e.target.value) })}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' required />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>Telefone</label>
                    <input type='tel' maxLength='15' placeholder='(00) 00000-0000' value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: mascaraTelefone(e.target.value) })}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' />
                  </div>

                  <div className='border-t border-gray-100 pt-4'>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Morador Visitado * <span className='text-gray-400 font-normal'>({moradores.length} disponíveis)</span>
                    </label>
                    {moradorSelecionado ? (
                      <div className='flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg'>
                        <div className='flex items-center gap-2'>
                          <FaHome className='text-emerald-600 text-sm' />
                          <div>
                            <p className='text-sm font-semibold text-emerald-900'>{moradorSelecionado.nome}</p>
                            <p className='text-xs text-emerald-600'>
                              {moradorSelecionado.bloco ? `Bloco ${moradorSelecionado.bloco} · ` : ''}
                              Apt. {moradorSelecionado.apartamento || '—'}
                            </p>
                          </div>
                        </div>
                        <button type='button' onClick={() => { setMoradorSelecionado(null); setBuscaMorador(''); }}
                          className='text-emerald-500 hover:text-emerald-700 text-sm font-semibold'>Trocar</button>
                      </div>
                    ) : (
                      <>
                        <div className='relative mb-2'>
                          <FaSearch className='absolute left-3 top-3 text-gray-400 text-sm' />
                          <input type='text' placeholder='Filtrar por nome, bloco ou apto...'
                            value={buscaMorador} onChange={(e) => setBuscaMorador(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div className='max-h-44 overflow-auto border border-gray-200 rounded-lg divide-y divide-gray-100'>
                          {moradoresFiltrados.length === 0 ? (
                            <p className='p-4 text-center text-sm text-gray-500'>
                              {moradores.length === 0 ? 'Nenhum morador disponível' : 'Nenhum encontrado'}
                            </p>
                          ) : (
                            moradoresFiltrados.map((m) => (
                              <button key={m.id} type='button'
                                onClick={() => { setMoradorSelecionado(m); setBuscaMorador(''); }}
                                className='w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors'>
                                <p className='text-sm font-semibold text-gray-900'>{m.nome}</p>
                                <p className='text-xs text-gray-500'>
                                  {m.bloco ? `Bloco ${m.bloco} · ` : ''}
                                  Apt. {m.apartamento || '—'}
                                </p>
                              </button>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>Funcionário Registrante</label>
                    <div className='flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg'>
                      <FaUserTie className='text-gray-500 text-sm' />
                      <span className='text-sm text-gray-800 font-medium'>{nomeFuncionarioLogado}</span>
                      {!idFuncionarioLogado && (
                        <span className='ml-auto text-xs text-red-600 font-semibold'>⚠ Não vinculado a funcionário</span>
                      )}
                    </div>
                  </div>

                  <div className='flex gap-3 pt-2'>
                    <button type='button' onClick={fecharModal}
                      className='flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors'>
                      Cancelar
                    </button>
                    <button type='submit' disabled={salvando || !idFuncionarioLogado}
                      className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2'>
                      <FaPaperPlane className='text-sm' />
                      {salvando ? 'Registrando...' : 'Registrar'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
