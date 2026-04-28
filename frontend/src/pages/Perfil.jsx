import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import CustomSidebar from "../components/CustomSidebar";
import EditProfile from "../components/EditProfile";
import { useAuth } from '../context/AuthContext';
import { buscarMoradorPorId } from '../services/moradoresService';
import { buscarFuncionarioPorId } from '../services/funcionariosService';
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBriefcase,
  FaSignOutAlt,
  FaEdit,
  FaClock,
  FaCheck,
  FaExclamationCircle,
  FaArrowRight,
} from 'react-icons/fa';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [morador, setMorador] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [activeTab, setActiveTab] = useState('dados');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const isMorador = user?.categoria === 'MORADOR';
    const isFuncionario = user?.categoria === 'FUNCIONARIO' || user?.categoria === 'ADMIN';

    let profileId = null;
    if (isMorador) {
      profileId = user?.moradorId;
    } else if (isFuncionario) {
      profileId = user?.funcionarioId;
    }

    if (!profileId) {
      console.error('ID do perfil não encontrado na sessão.');
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        if (isMorador) {
          const moradorData = await buscarMoradorPorId(profileId);
          setMorador(moradorData);
        } else if (isFuncionario) {
          const funcionarioData = await buscarFuncionarioPorId(profileId);
          setFuncionario(funcionarioData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  if (!user || isLoading || (!morador && !funcionario)) return null;

  // Mapear categorias para nomes amigáveis
  const categoriaMap = {
    'MORADOR': 'Morador',
    'FUNCIONARIO': 'Funcionário',
    'SINDICO': 'Síndico',
    'ZELADOR': 'Zelador',
  };

  const getNomeCategoria = (categoria) => {
    return categoriaMap[categoria] || categoria;
  };

  // Obter iniciais do nome
  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Cores para avatar baseado em categoria
  const getAvatarColors = (categoria) => {
    const colors = {
      'MORADOR': 'bg-blue-500',
      'FUNCIONARIO': 'bg-purple-500',
      'SINDICO': 'bg-amber-500',
      'ZELADOR': 'bg-green-500',
    };
    return colors[categoria] || 'bg-blue-500';
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const isMorador = user?.categoria === 'MORADOR';
  const dados = isMorador ? morador : funcionario;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CustomSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto">
          {isMorador ? renderPerfirMorador() : renderPerfilFuncionario()}
        </main>
      </div>

      {/* Modal de Editar Perfil */}
      <EditProfile 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={dados}
        categoria={user?.categoria}
      />
    </div>
  );

  function renderPerfirMorador() {
    return (
      <>
        {/* Header com Avatar */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* Avatar */}
              <div className={`${getAvatarColors(user.categoria)} h-24 w-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0`}>
                {getInitials(dados.nome)}
              </div>

              {/* Informações Principais */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {dados.nome}
                </h1>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <FaBriefcase className="text-sm" />
                    {getNomeCategoria(user.categoria)}
                  </span>
                  {(dados.apartamento != null || dados.bloco) && (
                    <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      <FaIdCard className="text-sm" />
                      {dados.apartamento != null ? `Apto. ${dados.apartamento}` : 'Sem apartamento'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-3">
                  {dados.email}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
                  <FaEdit className="text-sm" />
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200"
                >
                  <FaSignOutAlt className="text-sm" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dados')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'dados'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'seguranca'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Segurança
          </button>
          <button
            onClick={() => setActiveTab('atividade')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'atividade'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Atividade
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'dados' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card de Informações Pessoais */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Informações Pessoais
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <p className="text-gray-900 font-medium">{dados.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <p className="text-gray-900 font-medium">{dados.cpf || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <p className="text-gray-900 font-medium">{getNomeCategoria(user.categoria)}</p>
                </div>
                {(dados.apartamento != null || dados.bloco) && (
                  <>
                    {dados.apartamento != null && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apartamento
                        </label>
                        <p className="text-gray-900 font-medium">{dados.apartamento}</p>
                      </div>
                    )}
                    {dados.bloco && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bloco
                        </label>
                        <p className="text-gray-900 font-medium">{dados.bloco}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Card de Contato */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaEnvelope className="text-emerald-600" />
                Informações de Contato
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium break-all">{dados.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <p className="text-gray-900 font-medium">{dados.telefone || 'Não informado'}</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-100 transition-colors duration-200">
                    <FaEdit className="text-sm" />
                    Editar Contato
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card de Segurança */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCheck className="text-amber-600" />
                Status de Segurança
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-green-900 font-medium text-sm">Email Verificado</span>
                  <FaCheck className="text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <span className="text-yellow-900 font-medium text-sm">Autenticação de 2 Fatores</span>
                  <span className="text-yellow-600 text-sm">Desativada</span>
                </div>
              </div>
            </div>

            {/* Card de Senha */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h2>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Para maior segurança, altere sua senha periodicamente.
                </p>
                <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
                  <FaEdit className="text-sm" />
                  Alterar Senha
                </button>
              </div>
            </div>

            {/* Card de Sessões Ativas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-indigo-600" />
                Sessões Ativas
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Windows PC</p>
                    <p className="text-sm text-gray-600">Navegador Chrome</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Agora
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'atividade' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaClock className="text-indigo-600" />
              Atividade Recente
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FaSignOutAlt className="text-blue-600 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">Login realizado</p>
                  <p className="text-sm text-gray-600">Há 2 minutos</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-green-600 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">Perfil visualizado</p>
                  <p className="text-sm text-gray-600">Há 5 minutos</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <FaEdit className="text-purple-600 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">Perfil atualizado</p>
                  <p className="text-sm text-gray-600">Hoje às 10:30</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function renderPerfilFuncionario() {
    return (
      <>
        {/* Header com Avatar */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* Avatar */}
              <div className={`${getAvatarColors(user.categoria)} h-24 w-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0`}>
                {getInitials(dados.nome)}
              </div>

              {/* Informações Principais */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {dados.nome}
                </h1>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <FaBriefcase className="text-sm" />
                    {getNomeCategoria(user.categoria)}
                  </span>
                  {dados.cargoNome && (
                    <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      <FaIdCard className="text-sm" />
                      {dados.cargoNome}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-3">
                  {dados.email}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
                  <FaEdit className="text-sm" />
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200"
                >
                  <FaSignOutAlt className="text-sm" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dados')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'dados'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Dados Profissionais
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'seguranca'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Segurança
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'dados' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card de Informações Profissionais */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-purple-600" />
                Informações Profissionais
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <p className="text-gray-900 font-medium">{dados.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <p className="text-gray-900 font-medium">{dados.cpf || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <p className="text-gray-900 font-medium">{dados.cargoNome || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <p className="text-gray-900 font-medium">{getNomeCategoria(user.categoria)}</p>
                </div>
              </div>
            </div>

            {/* Card de Contato */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaEnvelope className="text-emerald-600" />
                Informações de Contato
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium break-all">{dados.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <p className="text-gray-900 font-medium">{user.telefone || 'Não informado'}</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-100 transition-colors duration-200">
                    <FaEdit className="text-sm" />
                    Editar Contato
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card de Segurança */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCheck className="text-amber-600" />
                Status de Segurança
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-green-900 font-medium text-sm">Email Verificado</span>
                  <FaCheck className="text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <span className="text-yellow-900 font-medium text-sm">Autenticação de 2 Fatores</span>
                  <span className="text-yellow-600 text-sm">Desativada</span>
                </div>
              </div>
            </div>

            {/* Card de Senha */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h2>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Para maior segurança, altere sua senha periodicamente.
                </p>
                <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
                  <FaEdit className="text-sm" />
                  Alterar Senha
                </button>
              </div>
            </div>

            {/* Card de Sessões Ativas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-indigo-600" />
                Sessões Ativas
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Windows PC</p>
                    <p className="text-sm text-gray-600">Navegador Chrome</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Agora
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Perfil;
