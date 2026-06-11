import { useState, useCallback, useEffect } from 'react';
import { registerUser } from '../services/userService';
import { buscarCategoriasCargo } from '../services/categoriaCargoService';
import {
  FaUser,
  FaIdCard,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaTimes,
} from 'react-icons/fa';

function mascaraTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function CadastroFuncionario({ onClose, onSuccess }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [cargoId, setCargoId] = useState('');
  const [listaCargos, setListaCargos] = useState([]);
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [rg, setRg] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoCargos, setCarregandoCargos] = useState(true);

  useEffect(() => {
    const carregarCargos = async () => {
      try {
        const dados = await buscarCategoriasCargo();
        setListaCargos(dados);
      } catch (err) {
        console.error('Erro ao carregar cargos:', err.message);
        setErro('Erro ao carregar cargos.');
      } finally {
        setCarregandoCargos(false);
      }
    };

    carregarCargos();
  }, []);

  const handleCpfChange = useCallback((e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    const masked = digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(masked);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErro('');
      setCarregando(true);

      if (senha !== confirmarSenha) {
        setErro('As senhas não coincidem.');
        setCarregando(false);
        return;
      }

      if (!cargoId) {
        setErro('Selecione um cargo.');
        setCarregando(false);
        return;
      }

      try {
        await registerUser({
          nome,
          cpf: cpf.replace(/\D/g, ''),
          senha,
          categoriaAcessoId: 3, // 3 = Funcionário
          cargoId: Number(cargoId),
          celular: telefone,
          email,
          rg,
        });
        
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } catch (err) {
        setErro(err.message || 'Erro ao cadastrar funcionário. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    },
    [nome, cpf, senha, confirmarSenha, cargoId, telefone, email, rg, onClose, onSuccess]
  );

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200';

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white'>
          <h2 className='text-xl font-bold text-gray-900'>Adicionar Funcionário</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='Fechar'
          >
            <FaTimes className='text-gray-500' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          {/* Dados Pessoais */}
          <div className='bg-gray-50 rounded-2xl border border-gray-100 p-6'>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              Dados pessoais
            </h3>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='nome'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Nome <span className='text-red-400'>*</span>
                  </label>
                  <div className='relative'>
                    <FaUser className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                    <input
                      id='nome'
                      type='text'
                      placeholder='Digite o nome'
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='cpf'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    CPF <span className='text-red-400'>*</span>
                  </label>
                  <div className='relative'>
                    <FaIdCard className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                    <input
                      id='cpf'
                      type='text'
                      placeholder='000.000.000-00'
                      value={cpf}
                      onChange={handleCpfChange}
                      maxLength={14}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    E-mail <span className='text-red-400'>*</span>
                  </label>
                  <div className='relative'>
                    <FaEnvelope className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                    <input
                      id='email'
                      type='email'
                      placeholder='Digite o e-mail'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='telefone'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Telefone
                  </label>
                  <div className='relative'>
                    <FaPhone className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                    <input
                      id='telefone'
                      type='text'
                      placeholder='(00) 00000-0000'
                      value={telefone}
                      onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor='rg'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  RG
                </label>
                <div className='relative'>
                  <FaIdCard className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                  <input
                    id='rg'
                    type='text'
                    placeholder='Digite o RG'
                    value={rg}
                    onChange={(e) => setRg(e.target.value.replace(/\D/g, ''))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados Profissionais */}
          <div className='bg-gray-50 rounded-2xl border border-gray-100 p-6'>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              Dados profissionais
            </h3>
            <div>
              <label
                htmlFor='cargo'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Cargo <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <FaBriefcase className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none' />
                <select
                  id='cargo'
                  value={cargoId}
                  onChange={(e) => setCargoId(e.target.value)}
                  required
                  disabled={carregandoCargos}
                  className={inputClass}
                >
                  <option value='' disabled>
                    {carregandoCargos ? 'Carregando...' : 'Selecione um cargo'}
                  </option>
                  {listaCargos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className='bg-gray-50 rounded-2xl border border-gray-100 p-6'>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              Segurança
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='senha'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Senha <span className='text-red-400'>*</span>
                </label>
                <div className='relative'>
                  <FaLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                  <input
                    id='senha'
                    type='password'
                    placeholder='Crie uma senha'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='confirmarSenha'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Confirmar senha <span className='text-red-400'>*</span>
                </label>
                <div className='relative'>
                  <FaLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                  <input
                    id='confirmarSenha'
                    type='password'
                    placeholder='Repita a senha'
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {erro && (
            <div className='bg-red-50 border border-red-100 rounded-xl p-3.5'>
              <p className='text-sm text-red-600 text-center font-medium'>
                {erro}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-3 justify-end pt-4 border-t border-gray-100'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={carregando || carregandoCargos}
              className='px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium flex items-center gap-2 transition-colors'
            >
              {carregando && (
                <div className='size-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              )}
              {carregando ? 'Salvando...' : 'Finalizar cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroFuncionario;
