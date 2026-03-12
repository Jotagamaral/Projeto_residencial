import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBuilding,
  FaIdCard,
  FaLock,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaCalendarAlt,
  FaBox,
  FaCheckCircle,
} from 'react-icons/fa';

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErro('');
      setSucesso(false);
      setCarregando(true);
      try {
        await login(cpf, senha);
        setSucesso(true);
      } catch (err) {
        setSucesso(false);
        setErro(
          err.message || 'Ocorreu um erro desconhecido. Tente novamente.'
        );
      } finally {
        setCarregando(false);
      }
    },
    [cpf, senha, login]
  );

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden'>
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
            Gestão condominial
            <br />
            simplificada
          </h2>
          <p className='text-blue-100 text-lg mb-12 max-w-md'>
            Tenha o controle do seu condomínio na palma da mão, de forma
            prática e moderna.
          </p>

          <div className='space-y-4'>
            {[
              {
                icon: FaUsers,
                title: 'Reclamações',
                desc: 'Registre e acompanhe ocorrências',
              },
              {
                icon: FaCalendarAlt,
                title: 'Reservas',
                desc: 'Agende áreas comuns facilmente',
              },
              {
                icon: FaBox,
                title: 'Encomendas',
                desc: 'Controle de entregas em tempo real',
              },
            ].map((item) => (
              <div
                key={item.title}
                className='flex items-center gap-4 bg-white/10 rounded-xl px-5 py-3.5'
              >
                <div className='flex size-10 items-center justify-center rounded-xl bg-white/10'>
                  <item.icon className='text-sm text-blue-200' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-white'>
                    {item.title}
                  </p>
                  <p className='text-xs text-blue-200'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-1 items-center justify-center px-4 py-8 sm:px-8'>
        <div className='w-full max-w-md'>
          <div className='flex items-center gap-3 mb-2 lg:hidden'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-blue-50'>
              <FaBuilding className='text-base text-blue-500' />
            </div>
            <span className='text-xl font-bold text-gray-900'>CondoSync</span>
          </div>

          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>Bem-vindo de volta</h1>
            <p className='text-sm text-gray-500 mt-1'>
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5'>
              <div>
                <label
                  htmlFor='cpf'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  CPF
                </label>
                <div className='relative'>
                  <FaIdCard className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                  <input
                    id='cpf'
                    type='text'
                    placeholder='Digite seu CPF'
                    required
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='senha'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Senha
                </label>
                <div className='relative'>
                  <FaLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs' />
                  <input
                    id='senha'
                    type='password'
                    placeholder='Digite sua senha'
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200'
                  />
                </div>
              </div>
            </div>

            {sucesso && (
              <div className='bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-center gap-2'>
                <FaCheckCircle className='text-sm text-emerald-500' />
                <p className='text-sm text-emerald-600 font-medium'>
                  Login realizado com sucesso! Redirecionando...
                </p>
              </div>
            )}

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
                  Entrar
                  <FaArrowRight className='text-xs' />
                </>
              )}
            </button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-500'>
              Não possui uma conta?{' '}
              <Link
                to='/cadastro'
                className='text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200'
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          <div className='mt-8 flex items-center justify-center gap-2 text-gray-400'>
            <FaShieldAlt className='text-xs' />
            <p className='text-xs'>
              Seus dados estão protegidos e anonimizados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
