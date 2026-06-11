import { useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { buscarFuncionarios, atualizarCargoFuncionario } from '../../services/funcionariosService';
import { buscarCategoriasCargo } from '../../services/categoriaCargoService';
import CadastroFuncionario from '../../components/CadastroFuncionario';
import DetalheFuncionario from '../../components/DetalheFuncionario';
import { FaUsers, FaSearch, FaPlus, FaInfoCircle } from 'react-icons/fa';

// A UI foi convertida para tabela — controle por linha abaixo

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');

  const [userCargo, setUserCargo] = useState('');
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setUserCargo(userObject.categoria);
      } catch (e) {
        console.error('Erro ao parsear user do localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const [listaFunc, listaCargos] = await Promise.all([
          buscarFuncionarios(),
          buscarCategoriasCargo(),
        ]);
        setFuncionarios(Array.isArray(listaFunc) ? listaFunc : []);
        setCargos(Array.isArray(listaCargos) ? listaCargos : []);
        setErro(null);
      } catch (err) {
        setErro('Erro ao carregar funcionários.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const handleCadastroSucesso = async () => {
    try {
      const listaFunc = await buscarFuncionarios();
      setFuncionarios(Array.isArray(listaFunc) ? listaFunc : []);
      setRowStates({}); // Limpa o cache para forçar reinicialização
    } catch (err) {
      console.error('Erro ao recarregar funcionários:', err);
    }
  };

  const handleDeleteFuncionario = (id) => {
    // Remove o funcionário da lista após delete
    setFuncionarios(prev => prev.filter(f => f.id !== id));
    setRowStates(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // estados por linha da tabela
  const [rowStates, setRowStates] = useState({});

  useEffect(() => {
    // inicializa estados por linha quando funcionários são carregados
    if (funcionarios && funcionarios.length > 0) {
      setRowStates((prev) => {
        const next = { ...prev };
        funcionarios.forEach((f) => {
          if (!next[f.id]) {
            next[f.id] = { selectedCargo: f.cargoId, saving: false, success: false, error: null };
          }
        });
        return next;
      });
    }
  }, [funcionarios]);

  const handleSelectChange = (id, value) => {
    setRowStates((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), selectedCargo: Number(value), error: null } }));
  };

  const handleSaveRow = async (id) => {
    const state = rowStates[id];
    if (!state) return;
    const current = funcionarios.find(f => f.id === id);
    if (!current) return;
    if (state.selectedCargo === current.cargoId) return;

    setRowStates(prev => ({ ...prev, [id]: { ...prev[id], saving: true, error: null } }));
    try {
      await atualizarCargoFuncionario(id, state.selectedCargo);
      setFuncionarios(prev => prev.map(f => f.id === id ? { ...f, cargoId: state.selectedCargo, cargoNome: cargos.find(c => c.id === state.selectedCargo)?.nome || f.cargoNome } : f));
      setRowStates(prev => ({ ...prev, [id]: { ...prev[id], saving: false, success: true } }));
      setTimeout(() => setRowStates(prev => ({ ...prev, [id]: { ...prev[id], success: false } })), 2500);
    } catch (e) {
      console.error(e);
      setRowStates(prev => ({ ...prev, [id]: { ...prev[id], saving: false, error: 'Falha ao salvar' } }));
      setErro('Erro ao atualizar cargo.');
    }
  };

  const funcionariosFiltrados = useMemo(() => {
    if (!busca) return funcionarios;
    const termo = busca.toLowerCase();
    return funcionarios.filter((f) => (f.nome || f.email || '').toLowerCase().includes(termo));
  }, [funcionarios, busca]);

  const isAdmin = userCargo === 'ADMIN';

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <main className='flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <div className='flex size-12 items-center justify-center rounded-2xl bg-indigo-50'>
                <FaUsers className='text-xl text-indigo-500' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Funcionários</h1>
                <p className='text-sm text-gray-500 mt-0.5'>{funcionarios.length} registros</p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => setMostrarCadastro(true)}
                className='flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors'
              >
                <FaPlus className='text-xs' />
                Adicionar funcionário
              </button>
            )}
          </div>

          <div className='flex flex-col sm:flex-row gap-3 mb-6'>
            <div className='relative flex-1 max-w-md'>
              <FaSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
              <input
                type='text'
                placeholder='Buscar funcionários...'
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
                <p className='text-sm text-gray-500'>Carregando funcionários...</p>
              </div>
            </div>
          )}

          {!loading && erro && (
            <div className='bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center'>
              <p className='text-sm text-red-500'>{erro}</p>
            </div>
          )}

          {!loading && !erro && (
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Nome</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>E-mail</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Cargo atual</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Alterar cargo</th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Ações</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {funcionariosFiltrados.map((f) => {
                    const rs = rowStates[f.id] || { selectedCargo: f.cargoId, saving: false, success: false, error: null };
                    return (
                      <tr key={f.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{f.nome || '—'}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{f.email || '—'}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{f.cargoNome || '—'}</td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {isAdmin ? (
                            <select
                              value={rs.selectedCargo}
                              onChange={(e) => handleSelectChange(f.id, e.target.value)}
                              className='py-2 px-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900'
                            >
                              {cargos.map((c) => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                              ))}
                            </select>
                          ) : (
                            <span className='text-xs text-gray-500'>Sem permissão</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          {isAdmin ? (
                            <div className='flex items-center justify-end gap-2'>
                              <button
                                onClick={() => handleSaveRow(f.id)}
                                disabled={rs.saving || rs.selectedCargo === f.cargoId}
                                className={`px-3 py-2 rounded-xl text-sm ${rs.saving || rs.selectedCargo === f.cargoId ? 'bg-gray-300 text-gray-700' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                              >
                                {rs.saving ? 'Salvando...' : rs.success ? 'Salvo' : 'Salvar'}
                              </button>
                              <button
                                onClick={() => setFuncionarioSelecionado(f)}
                                className='px-3 py-2 rounded-xl text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors flex items-center gap-1.5'
                              >
                                <FaInfoCircle className='text-xs' />
                                Info
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setFuncionarioSelecionado(f)}
                              className='px-3 py-2 rounded-xl text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors flex items-center gap-1.5'
                            >
                              <FaInfoCircle className='text-xs' />
                              Info
                            </button>
                          )}
                          {rs.error && <p className='text-xs text-red-500 mt-1'>{rs.error}</p>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {mostrarCadastro && (
        <CadastroFuncionario
          onClose={() => setMostrarCadastro(false)}
          onSuccess={handleCadastroSucesso}
        />
      )}

      {funcionarioSelecionado && (
        <DetalheFuncionario
          funcionario={funcionarioSelecionado}
          onClose={() => setFuncionarioSelecionado(null)}
          onDelete={handleDeleteFuncionario}
        />
      )}
    </div>
  );
}

export default Funcionarios;
