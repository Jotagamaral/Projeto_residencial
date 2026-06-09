import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import {
  buscarLocais,
  criarLocal,
  atualizarLocal,
  deletarLocal,
} from '../../services/locaisService';
import {
  buscarCategoriasCargo,
  criarCategoriaCargo,
  atualizarCategoriaCargo,
  deletarCategoriaCargo,
} from '../../services/categoriaCargoService';
import { confirmarAcao } from '../../utils/swal';
import {
  buscarStatusEncomendas,
  buscarStatusReclamacoes,
  buscarStatusReservas,
} from '../../services/dominioService';
import {
  FaBuilding,
  FaUserTie,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCogs,
} from 'react-icons/fa';

function Configuracoes() {
  const [activeTab, setActiveTab] = useState('locais');
  const [userCargo, setUserCargo] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  // States para Locais
  const [locais, setLocais] = useState([]);
  const [editingLocal, setEditingLocal] = useState(null); // local sendo editado
  const [novoLocal, setNovoLocal] = useState({ nome: '', capacidade: '' });

  // States para Cargos
  const [cargos, setCargos] = useState([]);
  const [editingCargo, setEditingCargo] = useState(null); // cargo sendo editado
  const [novoCargo, setNovoCargo] = useState({ nome: '' });

  // States para Domínios (Read-Only)
  const [statusEncomendas, setStatusEncomendas] = useState([]);
  const [statusReclamacoes, setStatusReclamacoes] = useState([]);
  const [statusReservas, setStatusReservas] = useState([]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setUserCargo(userObject.categoria);
      } catch (e) {
        console.error('Erro ao ler cargo do localStorage:', e);
      }
    }
  }, []);

  // Carrega os dados correspondentes à aba ativa
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErro(null);
      try {
        if (activeTab === 'locais') {
          const lista = await buscarLocais();
          setLocais(Array.isArray(lista) ? lista : []);
        } else if (activeTab === 'cargos') {
          const lista = await buscarCategoriasCargo();
          setCargos(Array.isArray(lista) ? lista : []);
        } else if (activeTab === 'dominios') {
          const [enc, rec, res] = await Promise.all([
            buscarStatusEncomendas(),
            buscarStatusReclamacoes(),
            buscarStatusReservas(),
          ]);
          setStatusEncomendas(Array.isArray(enc) ? enc : []);
          setStatusReclamacoes(Array.isArray(rec) ? rec : []);
          setStatusReservas(Array.isArray(res) ? res : []);
        }
      } catch (err) {
        setErro(err.message || 'Erro ao carregar dados da aba selecionada.');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [activeTab]);

  const triggerSucesso = (msg) => {
    setSucesso(msg);
    setTimeout(() => setSucesso(null), 3000);
  };

  // ---------------- OPERAÇÕES LOCAIS ----------------

  const handleCriarLocal = async (e) => {
    e.preventDefault();
    if (!novoLocal.nome.trim() || !novoLocal.capacidade) return;

    try {
      const payload = {
        nome: novoLocal.nome,
        capacidade: Number(novoLocal.capacidade),
      };
      const criado = await criarLocal(payload);
      setLocais((prev) => [...prev, criado]);
      setNovoLocal({ nome: '', capacidade: '' });
      triggerSucesso('Local cadastrado.');
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar local.');
    }
  };

  const handleSalvarEdicaoLocal = async (e) => {
    e.preventDefault();
    if (!editingLocal || !editingLocal.nome.trim() || !editingLocal.capacidade) return;

    try {
      const payload = {
        nome: editingLocal.nome,
        capacidade: Number(editingLocal.capacidade),
      };
      const atualizado = await atualizarLocal(editingLocal.id, payload);
      setLocais((prev) => prev.map((l) => (l.id === editingLocal.id ? atualizado : l)));
      setEditingLocal(null);
      triggerSucesso('Local atualizado.');
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar local.');
    }
  };

  const handleDeletarLocal = async (id) => {
    if (!await confirmarAcao('Inativar Local', 'Deseja realmente inativar este local?')) return;

    try {
      await deletarLocal(id);
      setLocais((prev) => prev.filter((l) => l.id !== id));
      triggerSucesso('Local inativado.');
    } catch (err) {
      setErro(err.message || 'Erro ao inativar local.');
    }
  };

  // ---------------- OPERAÇÕES CARGOS ----------------

  const handleCriarCargo = async (e) => {
    e.preventDefault();
    if (!novoCargo.nome.trim()) return;

    try {
      const criado = await criarCategoriaCargo(novoCargo);
      setCargos((prev) => [...prev, criado]);
      setNovoCargo({ nome: '' });
      triggerSucesso('Cargo cadastrado.');
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar cargo.');
    }
  };

  const handleSalvarEdicaoCargo = async (e) => {
    e.preventDefault();
    if (!editingCargo || !editingCargo.nome.trim()) return;

    try {
      const atualizado = await atualizarCategoriaCargo(editingCargo.id, { nome: editingCargo.nome });
      setCargos((prev) => prev.map((c) => (c.id === editingCargo.id ? atualizado : c)));
      setEditingCargo(null);
      triggerSucesso('Cargo atualizado.');
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar cargo.');
    }
  };

  const handleDeletarCargo = async (id) => {
    if (!await confirmarAcao('Inativar Cargo', 'Deseja realmente inativar este cargo?')) return;

    try {
      await deletarCategoriaCargo(id);
      setCargos((prev) => prev.filter((c) => c.id !== id));
      triggerSucesso('Cargo inativado.');
    } catch (err) {
      setErro(err.message || 'Erro ao inativar cargo.');
    }
  };

  const isAdmin = userCargo === 'ADMIN';

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CustomSidebar />
      <div className="w-full flex flex-col">
        <Navbar />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50">
                <FaCogs className="text-xl text-indigo-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configurações Administrativas</h1>
                <p className="text-sm text-gray-500 mt-0.5">Gerencie os parâmetros globais e áreas comuns do condomínio</p>
              </div>
            </div>
          </div>

          {/* Notificações */}
          {sucesso && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-fade-in shadow-sm">
              <FaCheck className="text-emerald-500 shrink-0" />
              <span>{sucesso}</span>
            </div>
          )}
          {erro && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm">
              <FaTimes className="text-rose-500 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 bg-white p-1 rounded-xl shadow-sm max-w-md">
            <button
              onClick={() => setActiveTab('locais')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'locais'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Locais (Áreas)
            </button>
            <button
              onClick={() => setActiveTab('cargos')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'cargos'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Cargos
            </button>
            <button
              onClick={() => setActiveTab('dominios')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'dominios'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Domínios (Status)
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="size-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Buscando dados...</p>
              </div>
            </div>
          )}

          {/* TAB LOCAIS */}
          {!loading && activeTab === 'locais' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário Novo Local */}
              {isAdmin ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm self-start">
                  <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaPlus className="text-indigo-500 text-xs" />
                    Novo Local
                  </h2>
                  <form onSubmit={handleCriarLocal} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome do Local</label>
                      <input
                        type="text"
                        placeholder="Ex: Salão de Festas"
                        value={novoLocal.nome}
                        onChange={(e) => setNovoLocal({ ...novoLocal, nome: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Capacidade de Pessoas</label>
                      <input
                        type="number"
                        placeholder="Ex: 50"
                        value={novoLocal.capacidade}
                        onChange={(e) => setNovoLocal({ ...novoLocal, capacidade: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200"
                    >
                      Cadastrar Local
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <FaInfoCircle className="text-gray-400" />
                  <p className="text-sm text-gray-500">Permissão de alteração restrita ao Administrador.</p>
                </div>
              )}

              {/* Lista de Locais */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Locais Ativos</h2>
                {locais.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-sm text-gray-500">Nenhum local cadastrado.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {locais.map((local) => {
                      const isEditing = editingLocal?.id === local.id;
                      return (
                        <div
                          key={local.id}
                          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                        >
                          {isEditing ? (
                            <form onSubmit={handleSalvarEdicaoLocal} className="space-y-3 w-full">
                              <div>
                                <input
                                  type="text"
                                  value={editingLocal.nome}
                                  onChange={(e) => setEditingLocal({ ...editingLocal, nome: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900"
                                  required
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={editingLocal.capacidade}
                                  onChange={(e) => setEditingLocal({ ...editingLocal, capacidade: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900"
                                  required
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                                >
                                  Salvar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingLocal(null)}
                                  className="flex-1 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="size-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <FaBuilding className="text-indigo-500 text-sm" />
                                  </div>
                                  <h3 className="font-semibold text-gray-900 text-sm">{local.nome}</h3>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Capacidade máxima: <span className="text-gray-800 font-bold">{local.capacidade} pessoas</span>
                                </p>
                              </div>
                              {isAdmin && (
                                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                                  <button
                                    onClick={() => setEditingLocal(local)}
                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                                  >
                                    <FaEdit /> Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeletarLocal(local.id)}
                                    className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto"
                                  >
                                    <FaTrash /> Inativar
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CARGOS */}
          {!loading && activeTab === 'cargos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário Novo Cargo */}
              {isAdmin ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm self-start">
                  <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaPlus className="text-indigo-500 text-xs" />
                    Novo Cargo
                  </h2>
                  <form onSubmit={handleCriarCargo} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome da Categoria</label>
                      <input
                        type="text"
                        placeholder="Ex: Zelador"
                        value={novoCargo.nome}
                        onChange={(e) => setNovoCargo({ nome: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200"
                    >
                      Cadastrar Cargo
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <FaInfoCircle className="text-gray-400" />
                  <p className="text-sm text-gray-500">Permissão de alteração restrita ao Administrador.</p>
                </div>
              )}

              {/* Lista de Cargos */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Categorias de Cargo Ativas</h2>
                {cargos.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-sm text-gray-500">Nenhum cargo cadastrado.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome da Categoria</th>
                          {isAdmin && (
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {cargos.map((cargo) => {
                          const isEditing = editingCargo?.id === cargo.id;
                          return (
                            <tr key={cargo.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {isEditing ? (
                                  <form onSubmit={handleSalvarEdicaoCargo} className="flex gap-2 max-w-xs">
                                    <input
                                      type="text"
                                      value={editingCargo.nome}
                                      onChange={(e) => setEditingCargo({ ...editingCargo, nome: e.target.value })}
                                      className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm text-gray-900"
                                      required
                                    />
                                    <button
                                      type="submit"
                                      className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                                    >
                                      <FaCheck className="text-xs" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingCargo(null)}
                                      className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl"
                                    >
                                      <FaTimes className="text-xs" />
                                    </button>
                                  </form>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <FaUserTie className="text-gray-400 text-xs" />
                                    {cargo.nome}
                                  </span>
                                )}
                              </td>
                              {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {!isEditing && (
                                    <div className="flex justify-end gap-3">
                                      <button
                                        onClick={() => setEditingCargo(cargo)}
                                        className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                                      >
                                        <FaEdit /> Editar
                                      </button>
                                      <button
                                        onClick={() => handleDeletarCargo(cargo.id)}
                                        className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                                      >
                                        <FaTrash /> Excluir
                                      </button>
                                    </div>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB DOMÍNIOS (STATUS READ-ONLY) */}
          {!loading && activeTab === 'dominios' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                <FaInfoCircle className="text-indigo-500 shrink-0" />
                <div className="text-sm text-gray-600">
                  <strong className="text-gray-800">Parâmetros de Domínio:</strong> Estes dados são carregados dinamicamente do banco de dados para representar as tabelas fixas de status que definem os fluxos do sistema. A modificação direta destas tabelas não é exposta por segurança para garantir a integridade dos fluxos transacionais.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Encomendas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    Status das Encomendas
                  </h3>
                  <ul className="space-y-2">
                    {statusEncomendas.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm py-1.5 px-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">{item.nome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Reclamações */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-orange-500" />
                    Status das Reclamações
                  </h3>
                  <ul className="space-y-2">
                    {statusReclamacoes.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm py-1.5 px-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">{item.nome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Reservas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Status das Reservas
                  </h3>
                  <ul className="space-y-2">
                    {statusReservas.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm py-1.5 px-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">{item.nome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Configuracoes;
