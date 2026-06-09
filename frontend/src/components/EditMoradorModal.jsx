import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaHome, FaCubes } from 'react-icons/fa';
import { atualizarMorador } from '../services/moradoresService';

export default function EditMoradorModal({ isOpen, onClose, morador, onSave }) {
  const [apartamento, setApartamento] = useState('');
  const [bloco, setBloco] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (morador) {
      setApartamento(morador.apartamento || '');
      setBloco(morador.bloco || '');
      setErro(null);
    }
  }, [morador]);

  if (!isOpen || !morador) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      const payload = {
        bloco: bloco.trim(),
        apartamento: Number(apartamento)
      };

      const resultado = await atualizarMorador(morador.id, payload);
      onSave(resultado);
      onClose();
    } catch (err) {
      setErro(err.message || 'Erro ao salvar alterações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all scale-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">Editar Residente</h2>
            <p className="text-xs text-gray-500 font-medium">{morador.nome}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
              {erro}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Apartamento *</label>
              <div className="relative">
                <FaHome className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input 
                  type="number" 
                  min="1"
                  max="9999"
                  placeholder="Ex: 101" 
                  value={apartamento}
                  onChange={(e) => setApartamento(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all duration-200" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Bloco *</label>
              <div className="relative">
                <FaCubes className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input 
                  type="text" 
                  maxLength="5"
                  placeholder="Ex: A" 
                  value={bloco}
                  onChange={(e) => setBloco(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all duration-200" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={salvando}
              className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {salvando ? (
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FaSave />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
