import { useState, useEffect } from 'react';
import { FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { deletarFuncionario, buscarFuncionarioPorId } from '../services/funcionariosService';

function DetalheFuncionario({ funcionario, onClose, onDelete }) {
  const [dadosCompletos, setDadosCompletos] = useState(funcionario);
  const [carregando, setCarregando] = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [erro, setErro] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const carregarDadosCompletos = async () => {
      setCarregando(true);
      try {
        const dados = await buscarFuncionarioPorId(funcionario.id);
        setDadosCompletos(dados);
        setErro(null);
      } catch (err) {
        console.error('Erro ao carregar dados completos do funcionário:', err);
        setDadosCompletos(funcionario); // Fallback para dados iniciais
        setErro(null); // Não exibir erro aqui, apenas usar dados parciais
      } finally {
        setCarregando(false);
      }
    };

    if (funcionario?.id) {
      carregarDadosCompletos();
    }
  }, [funcionario?.id, funcionario]);

  const handleDelete = async () => {
    setDeletando(true);
    setErro(null);
    try {
      await deletarFuncionario(funcionario.id);
      setConfirmDelete(false);
      onDelete(funcionario.id);
      onClose();
    } catch (err) {
      console.error('Erro ao desativar funcionário:', err);
      setErro(err.message || 'Erro ao desativar funcionário.');
      setDeletando(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-900'>Detalhes do Funcionário</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <FaTimes className='text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {carregando ? (
            <div className='flex justify-center py-8'>
              <div className='flex flex-col items-center gap-3'>
                <div className='size-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                <p className='text-xs text-gray-500'>Carregando dados...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Informações do Funcionário */}
              <div className='space-y-4 mb-6'>
                <div>
                  <label className='text-xs font-semibold text-gray-500 uppercase'>Nome</label>
                  <p className='text-sm text-gray-900 mt-1'>{dadosCompletos.nome || '—'}</p>
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-500 uppercase'>E-mail</label>
                  <p className='text-sm text-gray-900 mt-1'>{dadosCompletos.email || '—'}</p>
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-500 uppercase'>CPF</label>
                  <p className='text-sm text-gray-900 mt-1'>{dadosCompletos.cpf || '—'}</p>
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-500 uppercase'>RG</label>
                  <p className='text-sm text-gray-900 mt-1'>{dadosCompletos.rg || '—'}</p>
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-500 uppercase'>Telefone</label>
                  <p className='text-sm text-gray-900 mt-1'>{dadosCompletos.telefone || '—'}</p>
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-500 uppercase'>Cargo</label>
                  <p className='text-sm text-gray-900 mt-1'>{dadosCompletos.cargoNome || '—'}</p>
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-500 uppercase'>ID</label>
                  <p className='text-sm text-gray-600 mt-1'>#{dadosCompletos.id}</p>
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-6'>
                  <p className='text-xs text-red-600'>{erro}</p>
                </div>
              )}

              {/* Dialog de Confirmação */}
              {confirmDelete ? (
                <div className='space-y-4'>
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3'>
                    <FaExclamationTriangle className='text-red-500 mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='text-sm font-medium text-red-900'>Tem certeza?</p>
                      <p className='text-xs text-red-700 mt-1'>
                        Esta ação não pode ser desfeita. O funcionário será deletado permanentemente.
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deletando}
                      className='flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-medium transition-colors disabled:opacity-50'
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deletando}
                      className='flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50'
                    >
                      {deletando ? 'Deletando...' : 'Confirmar'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors border border-red-200'
                >
                  <FaTrash className='text-sm' />
                  Desativar Funcionário
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalheFuncionario;
