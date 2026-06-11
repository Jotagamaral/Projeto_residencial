import { useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import EditMoradorModal from '../../components/EditMoradorModal';
import { buscarMoradores, deletarMorador , atualizarStatusMorador} from '../../services/moradoresService';
import { confirmarAcao } from '../../utils/swal';
import { FaUsers, FaSearch, FaEdit, FaTrash, FaHome, FaInfoCircle } from 'react-icons/fa';

function Moradores() {
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [busca, setBusca] = useState('');

  // Estados do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [moradorParaEditar, setMoradorParaEditar] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setIsAdmin(userObject.categoria === 'ADMIN');
      } catch (e) {
        console.error('Erro ao ler permissões do usuário:', e);
      }
    }
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const lista = await buscarMoradores();
      setMoradores(Array.isArray(lista) ? lista : []);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar moradores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const triggerSucesso = (msg) => {
    setSucesso(msg);
    setTimeout(() => setSucesso(null), 3000);
  };

  const handleExcluir = async (id, nome) => {
    if (!await confirmarAcao('Inativar Morador', `Deseja realmente inativar o morador ${nome}?`)) return;

    try {
      await deletarMorador(id);
      setMoradores((prev) => prev.filter((m) => m.id !== id));
      triggerSucesso('Morador inativado com sucesso.');
    } catch (err) {
      setErro(err.message || 'Erro ao inativar morador.');
    }
  };

  const handleAbrirEdicao = (morador) => {
    setMoradorParaEditar(morador);
    setModalOpen(true);
  };

  const handleSalvarEdicao = (moradorAtualizado) => {
    setMoradores((prev) =>
      prev.map((m) => (m.id === moradorAtualizado.id ? { ...m, ...moradorAtualizado } : m))
    );
    triggerSucesso('Dados do morador atualizados com sucesso.');
  };

  const handleVerificar = async (id) => {
    try {
      setErro(null);
      
      // 1. Chame a função da sua API/Serviço passando o ID e o novo status
      // Nota: Ajuste o nome da função 'atualizarStatusMorador' se o seu arquivo de serviços usar outro nome
      await atualizarStatusMorador(id);

      // 2. Atualiza o estado local para refletir a mudança na tabela instantaneamente
      setMoradores((prev) =>
        prev.map((m) => (m.id === id ? { ...m, verificado: true } : m))
      );

      // 3. Dispara o banner de sucesso temporário
      triggerSucesso('Morador verificado com sucesso.');
    } catch (err) {
      // 4. Trata possíveis erros de rede ou permissão
      setErro(err.message || 'Erro ao verificar o morador.');
    }
  };

  const moradoresFiltrados = useMemo(() => {
    if (!busca.trim()) return moradores;
    const termo = busca.toLowerCase();
    return moradores.filter((m) =>
      (m.nome || '').toLowerCase().includes(termo) ||
      (m.cpf || '').toLowerCase().includes(termo) ||
      (m.email || '').toLowerCase().includes(termo) ||
      String(m.apartamento || '').includes(termo) ||
      (m.bloco || '').toLowerCase().includes(termo)
    );
  }, [moradores, busca]);

  if (!isAdmin) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <CustomSidebar />
        <div className="w-full flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <FaInfoCircle className="text-rose-500 text-lg" />
              <p className="text-sm font-semibold text-gray-700">Acesso negado: apenas Administradores têm permissão para acessar esta página.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                <FaUsers className="text-xl text-indigo-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Moradores</h1>
                <p className="text-sm text-gray-500 mt-0.5">Gerenciamento e relatório de moradores cadastrados</p>
              </div>
            </div>
          </div>

          {/* Notificações */}
          {sucesso && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-fade-in shadow-sm">
              <span className="text-emerald-500">✓</span>
              <span>{sucesso}</span>
            </div>
          )}
          {erro && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm">
              <span className="text-rose-500">✕</span>
              <span>{erro}</span>
            </div>
          )}

          {/* Barra de Busca */}
          <div className="relative mb-6 max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, e-mail, apto ou bloco..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Listagem */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="size-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Buscando moradores...</p>
              </div>
            ) : moradoresFiltrados.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Nenhum morador encontrado.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">E-mail</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bloco / Apartamento</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {moradoresFiltrados.map((morador) => (
                    <tr key={morador.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {morador.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {morador.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {morador.cpf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <FaHome className="text-gray-400 text-xs" />
                          {morador.bloco ? `Bloco ${morador.bloco} - ` : ''}Apt. {morador.apartamento || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {morador.verificado ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Verificado
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerificar(morador.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors duration-150"
                          >
                            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pendente (Verificar)
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleAbrirEdicao(morador)}
                            className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                          >
                            <FaEdit /> Editar
                          </button>
                          <button
                            onClick={() => handleExcluir(morador.id, morador.nome)}
                            className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                          >
                            <FaTrash /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <EditMoradorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        morador={moradorParaEditar}
        onSave={handleSalvarEdicao}
      />
    </div>
  );
}

export default Moradores;
