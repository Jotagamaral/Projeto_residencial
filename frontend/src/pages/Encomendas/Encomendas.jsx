import { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import EncomendasList from '../../components/EncomendasList';
import { buscarEncomendas } from '../../services/encomendasService';
import { useNavigate } from 'react-router-dom';

function Encomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [tipoCargo, setTipoCargo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setTipoCargo(userObject.categoria);
      } catch (e) {
        console.error('Erro ao parsear dados do usuário do localStorage:', e);
      }
    }

    async function carregarEncomendas() {
      try {
        const dados = await buscarEncomendas();
        setEncomendas(dados);
      } catch (error) {
        setErro('Erro ao carregar encomendas.');
      } finally {
        setLoading(false);
      }
    }
    carregarEncomendas();
  }, []);

  const handleNovaEncomenda = useCallback(() => {
    navigate('/cadastro_encomendas');
  }, [navigate]);

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <div className='px-4 mt-6'>
          <div className='flex items-center justify-center bg-blue-600 text-white text-xl font-semibold rounded-2xl shadow-md h-[120px] transition-all duration-300'>
            Encomendas
          </div>
        </div>
        <div className='mt-6 px-8 flex justify-center'>
          <div className='w-full max-w-4xl'>
            {loading && (
              <div className='flex justify-center py-12'>
                <p className='text-gray-500 text-lg'>
                  Carregando Encomendas...
                </p>
              </div>
            )}
            {!loading && erro && (
              <p className='text-red-500 text-center'>{erro}</p>
            )}
            {!loading && !erro && <EncomendasList encomendas={encomendas} />}
          </div>
        </div>
        {tipoCargo === 'FUNCIONARIO' && (
          <button
            className='fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 text-lg rounded-xl flex items-center justify-center gap-3 focus:outline-none focus:shadow-outline z-50 transition-all duration-300'
            onClick={handleNovaEncomenda}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <line
                x1='12'
                y1='5'
                x2='12'
                y2='19'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <line
                x1='5'
                y1='12'
                x2='19'
                y2='12'
                strokeWidth='3'
                strokeLinecap='round'
              />
            </svg>
            <span className='text-xl font-bold'>Nova encomenda</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Encomendas;
