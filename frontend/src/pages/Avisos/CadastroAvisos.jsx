import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import {
  buscarTodosAvisosGestao,
  publicarAviso,
  atualizarAviso,
  definirAtivoAviso,
} from '../../services/avisosService';
import {
  FaBullhorn,
  FaPlus,
  FaEdit,
  FaTimes,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
  FaArrowLeft,
  FaSearch,
  FaFilter,
} from 'react-icons/fa';

const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function toDateInputValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseApiError(error) {
  const data = error.response?.data;
  return (
    data?.detail ||
    data?.message ||
    data?.title ||
    (typeof data === 'string' ? data : null) ||
    'Ocorreu um erro. Tente novamente.'
  );
}

function ModalAvisoForm({
  isOpen,
  onClose,
  modoEdicao,
  titulo: tituloInicial,
  descricao: descricaoInicial,
  dataExpiracao: dataExpInicial,
  ativo: ativoInicial,
  onSubmit,
  salvando,
  erroModal,
}) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataExpiracao, setDataExpiracao] = useState('');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setTitulo(tituloInicial);
    setDescricao(descricaoInicial);
    setDataExpiracao(dataExpInicial);
    setAtivo(ativoInicial);
  }, [isOpen, tituloInicial, descricaoInicial, dataExpInicial, ativoInicial]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (salvando) return;
      if (e.target === e.currentTarget) onClose();
    },
    [onClose, salvando]
  );

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !salvando) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, salvando]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!dataExpiracao) return;
      onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        dataExpiracao: new Date(`${dataExpiracao}T12:00:00.000Z`).toISOString(),
        ativo,
      });
    },
    [titulo, descricao, dataExpiracao, ativo, onSubmit]
  );

  if (!isOpen) return null;

  const inputClass =
    'w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200';

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200'>
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-blue-50'>
              <FaBullhorn className='text-base text-blue-500' />
            </div>
            <div>
              <h2 className='text-base font-bold text-gray-900'>
                {modoEdicao ? 'Editar aviso' : 'Novo aviso'}
              </h2>
              <p className='text-xs text-gray-500 mt-0.5'>
                {modoEdicao
                  ? 'Atualize o conteúdo ou o período de vigência'
                  : 'O aviso ficará visível na home se estiver ativo'}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={salvando}
            className='flex size-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none'
          >
            <FaTimes className='text-xs' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='px-6 py-5 space-y-4'>
          <div>
            <label
              htmlFor='modal-aviso-titulo'
              className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'
            >
              Título
            </label>
            <input
              id='modal-aviso-titulo'
              type='text'
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={100}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor='modal-aviso-desc'
              className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'
            >
              Descrição
            </label>
            <textarea
              id='modal-aviso-desc'
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={4}
              className={`${inputClass} resize-y min-h-[100px]`}
            />
          </div>
          <div>
            <label
              htmlFor='modal-aviso-exp'
              className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'
            >
              Data de expiração
            </label>
            <div className='relative'>
              <FaCalendarAlt className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none' />
              <input
                id='modal-aviso-exp'
                type='date'
                value={dataExpiracao}
                onChange={(e) => setDataExpiracao(e.target.value)}
                required
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
          {modoEdicao && (
            <label className='flex items-center gap-3 cursor-pointer select-none'>
              <input
                type='checkbox'
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className='size-4 rounded border border-gray-300 accent-blue-600'
              />
              <span className='text-sm text-gray-700'>Aviso ativo (visível na home)</span>
            </label>
          )}
          {erroModal && (
            <div className='bg-red-50 border border-red-100 rounded-xl p-3'>
              <p className='text-xs text-red-600 text-center font-medium'>
                {erroModal}
              </p>
            </div>
          )}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={salvando}
              className='flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={salvando}
              className='flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-60'
            >
              {salvando ? 'Salvando...' : modoEdicao ? 'Salvar' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CadastroAvisos() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroLista, setErroLista] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [modalTitulo, setModalTitulo] = useState('');
  const [modalDescricao, setModalDescricao] = useState('');
  const [modalDataExp, setModalDataExp] = useState('');
  const [modalAtivo, setModalAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState(null);
  const [idsToggle, setIdsToggle] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('ativos');
  const [buscaRascunho, setBuscaRascunho] = useState('');
  const [periodoInicioRascunho, setPeriodoInicioRascunho] = useState('');
  const [periodoFimRascunho, setPeriodoFimRascunho] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [periodoInicioAplicado, setPeriodoInicioAplicado] = useState('');
  const [periodoFimAplicado, setPeriodoFimAplicado] = useState('');

  const carregarLista = useCallback(async () => {
    setLoading(true);
    try {
      const data = await buscarTodosAvisosGestao();
      setLista(Array.isArray(data) ? data : []);
      setErroLista(null);
    } catch {
      setErroLista('Não foi possível carregar os avisos.');
      setLista([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarLista();
  }, [carregarLista]);

  const listaOrdenada = useMemo(() => {
    return [...lista].sort((a, b) => {
      const ta = a.dataInicio ? new Date(a.dataInicio).getTime() : 0;
      const tb = b.dataInicio ? new Date(b.dataInicio).getTime() : 0;
      return tb - ta || (b.id || 0) - (a.id || 0);
    });
  }, [lista]);

  const totalAtivos = useMemo(
    () => lista.filter((i) => i.ativo).length,
    [lista]
  );
  const totalInativos = useMemo(
    () => lista.filter((i) => !i.ativo).length,
    [lista]
  );

  const listaFiltrada = useMemo(() => {
    let base = listaOrdenada.filter((item) =>
      abaAtiva === 'ativos' ? item.ativo : !item.ativo
    );
    const q = buscaAplicada.trim().toLowerCase();
    if (q) {
      base = base.filter(
        (item) =>
          item.titulo?.toLowerCase().includes(q) ||
          item.descricao?.toLowerCase().includes(q)
      );
    }
    if (periodoInicioAplicado) {
      const t0 = new Date(`${periodoInicioAplicado}T00:00:00.000Z`).getTime();
      base = base.filter((item) => {
        if (!item.dataInicio) return false;
        return new Date(item.dataInicio).getTime() >= t0;
      });
    }
    if (periodoFimAplicado) {
      const t1 = new Date(`${periodoFimAplicado}T23:59:59.999Z`).getTime();
      base = base.filter((item) => {
        if (!item.dataInicio) return false;
        return new Date(item.dataInicio).getTime() <= t1;
      });
    }
    return base;
  }, [
    listaOrdenada,
    abaAtiva,
    buscaAplicada,
    periodoInicioAplicado,
    periodoFimAplicado,
  ]);

  const temFiltrosAplicados =
    Boolean(buscaAplicada.trim()) ||
    Boolean(periodoInicioAplicado) ||
    Boolean(periodoFimAplicado);

  const handleBuscar = useCallback(() => {
    setBuscaAplicada(buscaRascunho);
    setPeriodoInicioAplicado(periodoInicioRascunho);
    setPeriodoFimAplicado(periodoFimRascunho);
  }, [buscaRascunho, periodoInicioRascunho, periodoFimRascunho]);

  const handleLimparFiltros = useCallback(() => {
    setBuscaRascunho('');
    setPeriodoInicioRascunho('');
    setPeriodoFimRascunho('');
    setBuscaAplicada('');
    setPeriodoInicioAplicado('');
    setPeriodoFimAplicado('');
  }, []);

  const abrirNovo = useCallback(() => {
    setEditandoId(null);
    setModalTitulo('');
    setModalDescricao('');
    setModalDataExp('');
    setModalAtivo(true);
    setErroModal(null);
    setModalAberto(true);
  }, []);

  const abrirEditar = useCallback((item) => {
    setEditandoId(item.id);
    setModalTitulo(item.titulo || '');
    setModalDescricao(item.descricao || '');
    setModalDataExp(toDateInputValue(item.dataExpiracao));
    setModalAtivo(Boolean(item.ativo));
    setErroModal(null);
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setEditandoId(null);
    setErroModal(null);
  }, []);

  const handleSubmitModal = useCallback(
    async (payload) => {
      setErroModal(null);
      setSalvando(true);
      try {
        if (editandoId != null) {
          await atualizarAviso(editandoId, payload);
        } else {
          await publicarAviso({
            titulo: payload.titulo,
            descricao: payload.descricao,
            dataExpiracao: payload.dataExpiracao,
          });
        }
        fecharModal();
        await carregarLista();
      } catch (error) {
        setErroModal(parseApiError(error));
        console.error(error);
      } finally {
        setSalvando(false);
      }
    },
    [editandoId, fecharModal, carregarLista]
  );

  const handleToggleAtivo = useCallback(
    async (item, proximoAtivo) => {
      if (idsToggle.includes(item.id)) return;
      setIdsToggle((prev) => [...prev, item.id]);
      try {
        await definirAtivoAviso(item.id, proximoAtivo);
        await carregarLista();
      } catch (error) {
        console.error(error);
      } finally {
        setIdsToggle((prev) => prev.filter((x) => x !== item.id));
      }
    },
    [idsToggle, carregarLista]
  );

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <main className='flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto'>
          <Link
            to='/home'
            className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 mb-6 group'
          >
            <FaArrowLeft className='text-xs group-hover:-translate-x-1 transition-transform duration-200' />
            Voltar para a home
          </Link>

          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <div className='flex size-12 items-center justify-center rounded-2xl bg-blue-50'>
                <FaBullhorn className='text-xl text-blue-500' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Avisos</h1>
                <p className='text-sm text-gray-500 mt-0.5'>
                  {lista.length} aviso(s) cadastrado(s)
                </p>
              </div>
            </div>
            <button
              type='button'
              onClick={abrirNovo}
              className='inline-flex items-center justify-center gap-2 shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-sm transition-all duration-200'
            >
              <FaPlus className='text-sm' />
              Novo aviso
            </button>
          </div>

          <div className='flex flex-wrap gap-2 mb-6 border-b border-gray-200'>
            <button
              type='button'
              onClick={() => setAbaAtiva('ativos')}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-semibold border-b-2 -mb-px transition-all duration-200 ${
                abaAtiva === 'ativos'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FaBullhorn className='text-sm opacity-80' />
              Ativos
            </button>
            <button
              type='button'
              onClick={() => setAbaAtiva('inativos')}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-semibold border-b-2 -mb-px transition-all duration-200 ${
                abaAtiva === 'inativos'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FaToggleOff className='text-sm opacity-80' />
              Inativos
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-emerald-50'>
                <FaToggleOn className='text-base text-emerald-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>{totalAtivos}</p>
                <p className='text-xs text-gray-500'>Avisos ativos</p>
              </div>
            </div>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-gray-100'>
                <FaToggleOff className='text-base text-gray-500' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>
                  {totalInativos}
                </p>
                <p className='text-xs text-gray-500'>Avisos inativos</p>
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
              {temFiltrosAplicados && (
                <button
                  type='button'
                  onClick={handleLimparFiltros}
                  className='flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors duration-200'
                >
                  <FaTimes className='text-[10px]' />
                  Limpar filtros
                </button>
              )}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div className='lg:col-span-1'>
                <label className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'>
                  Buscar
                </label>
                <div className='relative'>
                  <FaSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                  <input
                    type='text'
                    placeholder='Título ou descrição...'
                    value={buscaRascunho}
                    onChange={(e) => setBuscaRascunho(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'>
                  Período inicial
                </label>
                <div className='relative'>
                  <FaCalendarAlt className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none' />
                  <input
                    type='date'
                    value={periodoInicioRascunho}
                    onChange={(e) => setPeriodoInicioRascunho(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200 cursor-pointer'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'>
                  Período final
                </label>
                <div className='relative'>
                  <FaCalendarAlt className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none' />
                  <input
                    type='date'
                    value={periodoFimRascunho}
                    onChange={(e) => setPeriodoFimRascunho(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200 cursor-pointer'
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-wrap justify-end gap-2 mt-4'>
              <button
                type='button'
                onClick={handleLimparFiltros}
                className='inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200'
              >
                <FaTimes className='text-xs' />
                Limpar
              </button>
              <button
                type='button'
                onClick={handleBuscar}
                className='inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white shadow-sm transition-all duration-200'
              >
                <FaSearch className='text-xs' />
                Buscar
              </button>
            </div>
          </div>

          {loading && (
            <div className='flex justify-center py-12'>
              <div className='flex flex-col items-center gap-3'>
                <div className='size-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                <p className='text-sm text-gray-500'>Carregando avisos...</p>
              </div>
            </div>
          )}

          {!loading && erroLista && (
            <div className='bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center'>
              <p className='text-sm text-red-500'>{erroLista}</p>
            </div>
          )}

          {!loading && !erroLista && lista.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm'>
              <div className='flex size-16 items-center justify-center rounded-full bg-blue-50 mb-4'>
                <FaBullhorn className='text-2xl text-blue-300' />
              </div>
              <p className='text-base font-medium text-gray-900'>
                Nenhum aviso cadastrado
              </p>
              <p className='mt-1 text-sm text-gray-500 max-w-sm'>
                Use &quot;Novo aviso&quot; para publicar o primeiro comunicado.
              </p>
            </div>
          )}

          {!loading && !erroLista && lista.length > 0 && (
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
              {listaFiltrada.length === 0 ? (
                <div className='py-16 text-center px-4'>
                  <p className='text-sm font-medium text-gray-900'>
                    Nenhum aviso encontrado
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    Ajuste os filtros ou troque de aba.
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full min-w-[720px] text-left text-sm'>
                    <thead>
                      <tr className='bg-gray-50 border-b border-gray-200'>
                        <th className='px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500'>
                          Título
                        </th>
                        <th className='px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 max-w-[220px]'>
                          Descrição
                        </th>
                        <th className='px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap'>
                          Publicado
                        </th>
                        <th className='px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap'>
                          Expira
                        </th>
                        <th className='px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap'>
                          Status
                        </th>
                        <th className='px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right whitespace-nowrap'>
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {listaFiltrada.map((item, index) => {
                        const toggleBusy = idsToggle.includes(item.id);
                        const zebra = index % 2 === 1 ? 'bg-gray-50/60' : '';
                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-blue-50/40 transition-colors ${zebra}`}
                          >
                            <td className='px-4 py-3 font-medium text-gray-900 align-top max-w-[180px]'>
                              <span className='line-clamp-2'>{item.titulo}</span>
                            </td>
                            <td className='px-4 py-3 text-gray-600 align-top max-w-[240px]'>
                              <span className='line-clamp-3 whitespace-pre-wrap'>
                                {item.descricao}
                              </span>
                            </td>
                            <td className='px-4 py-3 text-gray-600 align-top whitespace-nowrap text-xs'>
                              {item.dataInicio
                                ? formatadorData.format(
                                    new Date(item.dataInicio)
                                  )
                                : '—'}
                            </td>
                            <td className='px-4 py-3 text-gray-600 align-top whitespace-nowrap text-xs'>
                              {item.dataExpiracao
                                ? formatadorData.format(
                                    new Date(item.dataExpiracao)
                                  )
                                : '—'}
                            </td>
                            <td className='px-4 py-3 align-top whitespace-nowrap'>
                              <span
                                className={`inline-flex text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                                  item.ativo
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {item.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className='px-4 py-3 align-top'>
                              <div className='flex items-center justify-end gap-1'>
                                <button
                                  type='button'
                                  onClick={() => abrirEditar(item)}
                                  className='flex size-9 items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200'
                                  aria-label='Editar'
                                >
                                  <FaEdit className='text-sm' />
                                </button>
                                <button
                                  type='button'
                                  disabled={toggleBusy}
                                  onClick={() =>
                                    handleToggleAtivo(item, !item.ativo)
                                  }
                                  className='flex size-9 items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-40'
                                  aria-label={
                                    item.ativo ? 'Inativar' : 'Ativar'
                                  }
                                >
                                  {item.ativo ? (
                                    <FaToggleOn className='text-lg text-emerald-600' />
                                  ) : (
                                    <FaToggleOff className='text-lg text-gray-400' />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ModalAvisoForm
        isOpen={modalAberto}
        onClose={fecharModal}
        modoEdicao={editandoId != null}
        titulo={modalTitulo}
        descricao={modalDescricao}
        dataExpiracao={modalDataExp}
        ativo={modalAtivo}
        onSubmit={handleSubmitModal}
        salvando={salvando}
        erroModal={erroModal}
      />
    </div>
  );
}

export default CadastroAvisos;
