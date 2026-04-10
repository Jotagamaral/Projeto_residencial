import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { publicarReclamacao } from '../../services/reclamacoeService';
import { useNavigate } from 'react-router-dom';
import {
  FaComments,
  FaArrowLeft,
  FaUserSecret,
  FaUser,
  FaPaperPlane,
  FaInfoCircle,
  FaShieldAlt,
} from 'react-icons/fa';

function CadastroReclamacoes() {
  const [textoReclamacao, setTextoReclamacao] = useState('');
  const [titulo, setTitulo] = useState('');
  const [nomeMorador, setNomeMorador] = useState('');
  const [moradorId, setMoradorId] = useState(null);
  const [anonimo, setAnonimo] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setNomeMorador(userObject.nome);
        setMoradorId(userObject.id);
      } catch (e) {
        console.error('Erro ao parsear dados do usuário:', e);
      }
    }
  }, []);

  const handleTextChange = useCallback((e) => {
    setTextoReclamacao(e.target.value);
    setCharCount(e.target.value.length);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!titulo.trim() || !textoReclamacao.trim()) {
        alert('O título e a descrição são obrigatórios!');
        return;
      }

      if (!moradorId) {
        alert('ID do morador não disponível. Tente relogar.');
        return;
      }

      // O objeto agora reflete EXATAMENTE o que o backend espera
      const reclamacaoData = {
        titulo: titulo,
        descricao: textoReclamacao,
      };

      try {
        await publicarReclamacao(reclamacaoData);
        setTitulo('');
        setTextoReclamacao('');
        navigate('/reclamacoes', { state: { reload: true } });
      } catch (error) {
        console.error('[CadastroReclamacoes.jsx]: ', error);
        alert('Erro ao enviar reclamação. Tente novamente.');
      }
    },
    [titulo, textoReclamacao, moradorId, navigate]
  );

  const handleVoltar = useCallback(() => {
    navigate('/reclamacoes');
  }, [navigate]);

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <main className='flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 overflow-auto'>
          <button
            onClick={handleVoltar}
            className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 mb-6 group'
          >
            <FaArrowLeft className='text-xs group-hover:-translate-x-1 transition-transform duration-200' />
            Voltar para reclamações
          </button>

          <div className='flex items-center gap-4 mb-8'>
            <div className='flex size-12 items-center justify-center rounded-2xl bg-orange-50'>
              <FaComments className='text-xl text-orange-500' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Nova Reclamação
              </h1>
              <p className='text-sm text-gray-500 mt-0.5'>
                Descreva o problema para que possamos resolver
              </p>
            </div>
          </div>

          <div className='grid gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <form onSubmit={handleSubmit}>
                <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                  <div className='px-6 py-5 border-b border-gray-100'>
                    <h2 className='text-base font-semibold text-gray-900'>
                      Detalhes da reclamação
                    </h2>
                    <p className='text-xs text-gray-500 mt-0.5'>
                      Preencha as informações abaixo
                    </p>
                  </div>

                  <div className='p-6 space-y-6'>
                    <div>
                      <label htmlFor='tituloReclamacao' className='block text-sm font-medium text-gray-700 mb-2'>
                        Título da reclamação
                      </label>
                      <input
                        id='tituloReclamacao'
                        type='text'
                        placeholder='Ex: Vaga de garagem ocupada'
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                        className='w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='textoReclamacao'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Descrição da reclamação
                      </label>
                      <textarea
                        id='textoReclamacao'
                        placeholder='Descreva detalhadamente o problema que deseja reportar...'
                        value={textoReclamacao}
                        onChange={handleTextChange}
                        required
                        rows={6}
                        className='w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200'
                      />
                      <div className='flex justify-end mt-1.5'>
                        <span
                          className={`text-[11px] ${
                            charCount > 500
                              ? 'text-amber-500'
                              : 'text-gray-400'
                          }`}
                        >
                          {charCount} caracteres
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-200'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`flex size-9 items-center justify-center rounded-lg ${
                            anonimo ? 'bg-blue-50' : 'bg-gray-200/60'
                          }`}
                        >
                          <FaUserSecret
                            className={`text-sm ${
                              anonimo ? 'text-blue-500' : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            Reclamação anônima
                          </p>
                          <p className='text-xs text-gray-500'>
                            Seu nome não será exibido
                          </p>
                        </div>
                      </div>
                      <button
                        type='button'
                        role='switch'
                        aria-checked={anonimo}
                        onClick={() => setAnonimo(!anonimo)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          anonimo ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                            anonimo ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {!anonimo && (
                      <div>
                        <label
                          htmlFor='nomeMorador'
                          className='block text-sm font-medium text-gray-700 mb-2'
                        >
                          Nome do morador
                        </label>
                        <div className='relative'>
                          <FaUser className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                          <input
                            id='nomeMorador'
                            type='text'
                            placeholder='Nome do Morador'
                            value={nomeMorador}
                            disabled
                            className='w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-500 disabled:cursor-not-allowed focus:outline-none transition-all duration-200'
                          />
                        </div>
                        <p className='mt-1.5 text-[11px] text-gray-400 flex items-center gap-1'>
                          <FaInfoCircle className='text-[10px]' />
                          Nome preenchido automaticamente a partir do seu perfil
                        </p>
                      </div>
                    )}

                    <div className='pt-2'>
                      <button
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm'
                      >
                        <FaPaperPlane className='text-xs' />
                        Enviar reclamação
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className='space-y-4'>
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex size-9 items-center justify-center rounded-xl bg-blue-50'>
                    <FaInfoCircle className='text-sm text-blue-500' />
                  </div>
                  <h3 className='text-sm font-semibold text-gray-900'>
                    Como funciona?
                  </h3>
                </div>
                <ul className='space-y-3'>
                  {[
                    'Descreva o problema com o máximo de detalhes',
                    'A administração receberá sua reclamação',
                    'Você pode acompanhar o status no mural',
                    'Reclamações são respondidas em até 48h',
                  ].map((item, idx) => (
                    <li key={idx} className='flex items-start gap-2.5'>
                      <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-500 mt-0.5'>
                        {idx + 1}
                      </span>
                      <p className='text-xs text-gray-600 leading-relaxed'>
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='flex size-9 items-center justify-center rounded-xl bg-emerald-50'>
                    <FaShieldAlt className='text-sm text-emerald-500' />
                  </div>
                  <h3 className='text-sm font-semibold text-gray-900'>
                    Privacidade
                  </h3>
                </div>
                <p className='text-xs text-gray-500 leading-relaxed'>
                  Reclamações anônimas protegem completamente sua identidade.
                  Apenas a administração terá acesso ao conteúdo da reclamação.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CadastroReclamacoes;
