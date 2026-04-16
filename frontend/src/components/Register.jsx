import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { buscarCategoriasCargo } from '../services/categoriaCargoService';
import {
  FaBuilding,
  FaUser,
  FaIdCard,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaCubes,
  FaBriefcase,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt,
} from 'react-icons/fa';

function Register() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(2);
  const [apartamento, setApartamento] = useState('');
  const [bloco, setBloco] = useState('');
  const [cargoId, setCargoId] = useState('');
  const [listaCargos, setListaCargos] = useState([]);
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [rg, setRg] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const carregarCargos = async () => {
    if (tipoUsuario === 3) {
      try {
        const dados = await buscarCategoriasCargo();
        setListaCargos(dados);
      } catch (err) {
        console.error('Erro na tela de registro:', err.message);
      }
    }
  };

  carregarCargos();
}, [tipoUsuario]);

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

      try {
        await registerUser({
          nome,
          cpf: cpf.replace(/\D/g, ''),
          senha,
          categoriaAcessoId: tipoUsuario,
          apartamento: apartamento ? Number(apartamento) : null,
          bloco: bloco ? bloco.charAt(0) : null,
          cargoId: cargoId ? Number(cargoId) : null,
          celular: telefone,
          email,
          rg,
        });
        navigate('/login');
      } catch (err) {
        setErro(err.message || 'Erro ao cadastrar. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    },
    [
      nome,
      cpf,
      senha,
      confirmarSenha,
      tipoUsuario,
      apartamento,
      bloco,
      cargoId,
      telefone,
      email,
      rg,
      navigate,
    ]
  );

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200';

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='hidden lg:flex lg:w-2/5 bg-blue-600 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2' />
        <div className='absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full translate-y-1/3 -translate-x-1/3' />

        <div className='relative z-10 flex flex-col justify-center px-16 py-12'>
          <div className='flex items-center gap-3 mb-12'>
            <div className='flex size-12 items-center justify-center rounded-2xl bg-white/10'>
              <FaBuilding className='text-xl text-white' />
            </div>
            <span className='text-2xl font-bold text-white'>CondoSync</span>
          </div>

          <h2 className='text-4xl font-bold text-white leading-tight mb-4'>
            Faça parte da
            <br />
            comunidade
          </h2>
          <p className='text-blue-100 text-lg mb-12 max-w-md'>
            Crie sua conta e tenha acesso a todas as funcionalidades do
            condomínio em um só lugar.
          </p>

          <div className='bg-white/10 rounded-2xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='flex size-9 items-center justify-center rounded-xl bg-white/10'>
                <FaShieldAlt className='text-sm text-blue-200' />
              </div>
              <p className='text-sm font-semibold text-white'>
                Segurança garantida
              </p>
            </div>
            <ul className='space-y-2.5'>
              {[
                'Dados criptografados e protegidos',
                'Acesso controlado por perfil',
                'Reclamações anônimas disponíveis',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className='flex items-center gap-2.5 text-sm text-blue-100'
                >
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-[10px] font-bold text-white'>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className='flex flex-1 items-start justify-center px-4 py-8 sm:px-8 overflow-auto'>
        <div className='w-full max-w-2xl'>
          <Link
            to='/login'
            className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 mb-6 group'
          >
            <FaArrowLeft className='text-xs group-hover:-translate-x-1 transition-transform duration-200' />
            Voltar para login
          </Link>

          <div className='flex items-center gap-3 mb-2 lg:hidden'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-blue-50'>
              <FaBuilding className='text-base text-blue-500' />
            </div>
            <span className='text-xl font-bold text-gray-900'>CondoSync</span>
          </div>

          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>Criar conta</h1>
            <p className='text-sm text-gray-500 mt-1'>
              Preencha seus dados para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h2 className='text-sm font-semibold text-gray-900'>
                  Tipo de usuário
                </h2>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    type='button'
                    onClick={() => setTipoUsuario(2)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      tipoUsuario === 2
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                        tipoUsuario === 2
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-400'
                      }`}
                    >
                      <FaHome className='text-sm' />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        tipoUsuario === 2 ? 'text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      Morador
                    </span>
                  </button>
                  <button
                    type='button'
                    onClick={() => setTipoUsuario(3)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      tipoUsuario === 3
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                        tipoUsuario === 3
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-400'
                      }`}
                    >
                      <FaBriefcase className='text-sm' />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        tipoUsuario === 3 ? 'text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      Funcionário
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h2 className='text-sm font-semibold text-gray-900'>
                  Dados pessoais
                </h2>
              </div>
              <div className='p-6 space-y-4'>
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
                        placeholder='Digite seu nome'
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
                        placeholder='Digite seu e-mail'
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
                        onChange={(e) => setTelefone(e.target.value)}
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
                      placeholder='Digite seu RG'
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {tipoUsuario === 2 && (
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-100'>
                  <h2 className='text-sm font-semibold text-gray-900'>
                    Dados do apartamento
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label
                        htmlFor='apartamento'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Apartamento <span className='text-red-400'>*</span>
                      </label>
                      <div className='relative'>
                        <FaHome className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                        <input
                          id='apartamento'
                          type='text'
                          placeholder='Nº do apartamento'
                          value={apartamento}
                          onChange={(e) => setApartamento(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor='bloco'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Bloco <span className='text-red-400'>*</span>
                      </label>
                      <div className='relative'>
                        <FaCubes className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                        <input
                          id='bloco'
                          type='text'
                          placeholder='Bloco'
                          value={bloco}
                          onChange={(e) => setBloco(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tipoUsuario === 3 && (
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-100'>
                  <h2 className='text-sm font-semibold text-gray-900'>
                    Dados profissionais
                  </h2>
                </div>
                <div className='p-6'>
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
                        className={inputClass}
                      >
                        <option value='' disabled>
                          Selecione um cargo
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
              </div>
            )}

            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h2 className='text-sm font-semibold text-gray-900'>
                  Segurança
                </h2>
              </div>
              <div className='p-6'>
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
            </div>

            {erro && (
              <div className='bg-red-50 border border-red-100 rounded-xl p-3.5'>
                <p className='text-sm text-red-600 text-center font-medium'>
                  {erro}
                </p>
              </div>
            )}

            <button
              type='submit'
              disabled={carregando}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm'
            >
              {carregando ? (
                <div className='size-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <>
                  Finalizar cadastro
                  <FaArrowRight className='text-xs' />
                </>
              )}
            </button>

            <p className='text-center text-sm text-gray-500'>
              Já possui uma conta?{' '}
              <Link
                to='/login'
                className='text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200'
              >
                Faça login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
