import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { atualizarDadosPessoais, alterarSenhaMorador } from '../services/moradoresService';

function EditProfile({ isOpen, onClose, user, categoria }) {
  const [activeTab, setActiveTab] = useState('dados');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    cpf: user?.cpf || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    rg: user?.rg || ''
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    senhaNova: '',
    confirmarSenha: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSenhaChange = (e) => {
    const { name, value } = e.target;
    setSenhaData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Chama a service enviando o ID e o objeto formatado
      await atualizarDadosPessoais(user.id, {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        rg: formData.rg
      });

      setSuccessMessage('Dados atualizados com sucesso!');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    
    if (senhaData.senhaNova !== senhaData.confirmarSenha) {
      setErrorMessage('As senhas não conferem');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // O objeto enviado deve bater exatamente com a MoradorAlterarSenhaDto do C#
      await alterarSenhaMorador(user.id, {
        senhaAtual: senhaData.senhaAtual,
        novaSenha: senhaData.senhaNova,
        confirmarNovaSenha: senhaData.confirmarSenha
      });

      setSuccessMessage('Senha alterada com sucesso!');
      setSenhaData({ senhaAtual: '', senhaNova: '', confirmarSenha: '' });
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setErrorMessage(error.message);
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
    'ADMIN': 'Administrador',
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-600 px-6 py-5">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Alertas */}
          {(successMessage || errorMessage) && (
            <div className="px-6 pt-4">
              {successMessage && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                  <FaCheck className="flex-shrink-0" />
                  <span className="text-sm font-medium">{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <FaExclamationCircle className="flex-shrink-0" />
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 px-6 py-6">
            <button
              onClick={() => setActiveTab('dados')}
              className={`flex-1 py-2.5 font-bold text-sm rounded-xl transition-all ${
                activeTab === 'dados' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab('seguranca')}
              className={`flex-1 py-2.5 font-bold text-sm rounded-xl transition-all ${
                activeTab === 'seguranca' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              Segurança
            </button>
          </div>

          <div className="px-6 pb-8">
            {activeTab === 'dados' && (
              <form onSubmit={handleSalvarDados} className="space-y-6">
                {/* Banner Categoria */}
                <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 text-center">
                  <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-1">Sua Categoria</p>
                  <p className="text-lg font-bold text-blue-700">{categoriaMap[categoria] || categoria}</p>
                </div>

                {/* Seção Dados Pessoais */}
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 ml-1">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">Nome *</label>
                      <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">CPF *</label>
                      <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">E-mail *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">Telefone</label>
                      <input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">RG</label>
                      <input type="text" name="rg" value={formData.rg} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="Digite seu RG" />
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancelar</button>
                  <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50">
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'seguranca' && (
              <form onSubmit={handleAlterarSenha} className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 ml-1">Redefinir Senha</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">Senha Atual *</label>
                      <input type="password" name="senhaAtual" value={senhaData.senhaAtual} onChange={handleSenhaChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">Nova Senha *</label>
                      <input type="password" name="senhaNova" value={senhaData.senhaNova} onChange={handleSenhaChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">Confirmar Nova Senha *</label>
                      <input type="password" name="confirmarSenha" value={senhaData.confirmarSenha} onChange={handleSenhaChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancelar</button>
                  <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50">
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default EditProfile;