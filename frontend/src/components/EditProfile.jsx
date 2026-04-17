import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function EditProfile({ isOpen, onClose, user }) {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dados');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Efeito para desabilitar scroll quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    cpf: user?.cpf || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    rg: user?.rg || '',
    apartamento: user?.unidade || '',
    bloco: user?.bloco || '',
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    senhaNova: '',
    confirmarSenha: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSenhaChange = (e) => {
    const { name, value } = e.target;
    setSenhaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/usuarios/atualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          email: formData.email,
          telefone: formData.telefone,
          rg: formData.rg,
          unidade: formData.apartamento,
          bloco: formData.bloco,
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar dados');
      }

      setSuccessMessage('Dados atualizados com sucesso!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (senhaData.senhaNova !== senhaData.confirmarSenha) {
      setErrorMessage('As senhas não conferem');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/alterar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          senhaAtual: senhaData.senhaAtual,
          senhaNova: senhaData.senhaNova,
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar senha');
      }

      setSuccessMessage('Senha alterada com sucesso!');
      setSenhaData({
        senhaAtual: '',
        senhaNova: '',
        confirmarSenha: '',
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categoriaMap = {
    'MORADOR': 'Morador',
    'FUNCIONARIO': 'Funcionário',
    'SINDICO': 'Síndico',
    'ZELADOR': 'Zelador',
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 sticky top-0">
          <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mensagens de Sucesso/Erro */}
        {successMessage && (
          <div className="mx-6 mt-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <FaCheck className="flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <FaExclamationCircle className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('dados')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
              activeTab === 'dados'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
              activeTab === 'seguranca'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            Segurança
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dados' && (
            <form onSubmit={handleSalvarDados} className="space-y-6">
              {/* Categoria */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex-1 text-center p-4 rounded-xl border-2 border-blue-300 bg-blue-50">
                  <p className="text-sm text-gray-600 mb-1">Sua Categoria</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {categoriaMap[user?.categoria] || user?.categoria}
                  </p>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Digite seu nome"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RG
                    </label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Digite seu RG"
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Apartamento */}
              {user?.categoria === 'MORADOR' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Apartamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartamento *
                      </label>
                      <input
                        type="text"
                        name="apartamento"
                        value={formData.apartamento}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Nº do apartamento"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bloco *
                      </label>
                      <input
                        type="text"
                        name="bloco"
                        value={formData.bloco}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Bloco"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'seguranca' && (
            <form onSubmit={handleAlterarSenha} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual *
                    </label>
                    <input
                      type="password"
                      name="senhaAtual"
                      value={senhaData.senhaAtual}
                      onChange={handleSenhaChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Digite sua senha atual"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha *
                    </label>
                    <input
                      type="password"
                      name="senhaNova"
                      value={senhaData.senhaNova}
                      onChange={handleSenhaChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Digite sua nova senha"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <input
                      type="password"
                      name="confirmarSenha"
                      value={senhaData.confirmarSenha}
                      onChange={handleSenhaChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Confirme sua nova senha"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default EditProfile;
