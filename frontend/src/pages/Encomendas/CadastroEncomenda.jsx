import { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { useNavigate } from 'react-router-dom';
import {
  publicarEncomenda,
  buscarMoradores,
} from '../../services/encomendasService';

function CadastroEncomenda() {
  const [remetente, setRemetente] = useState('');
  const [moradorId, setMoradorId] = useState('');
  const [funcionarioId, setFuncionarioId] = useState(null);
  const [listaMoradores, setListaMoradores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const userObject = JSON.parse(userString);
          setFuncionarioId(userObject.id);
        } catch (e) {
          console.error(
            'Erro ao parsear dados do usuário do localStorage:',
            e
          );
        }
      }

      try {
        const moradoresRetorno = await buscarMoradores();
        setListaMoradores(moradoresRetorno);
      } catch (error) {
        console.error('Erro ao buscar por moradores: ', error);
      }
    };

    carregarDados();
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!remetente.trim()) {
        alert('O remetente é obrigatório!');
        return;
      }
      if (!moradorId) {
        alert('Selecione um destinatário (morador)!');
        return;
      }
      if (!funcionarioId) {
        alert('ID do funcionário não disponível. Tente relogar.');
        return;
      }

      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const formattedHoraEntrega = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const encomendaData = {
        remetente: remetente,
        moradorId: moradorId,
        funcionarioId: funcionarioId,
        horaEntrega: formattedHoraEntrega,
      };

      try {
        await publicarEncomenda(encomendaData);
        setRemetente('');
        navigate('/encomendas');
      } catch (error) {
        console.error('[CadastroEncomendas.jsx]: ', error);
      }
    },
    [remetente, moradorId, funcionarioId, navigate]
  );

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <CustomSidebar />
      <div className='w-full'>
        <Navbar />
        <div className='px-4 mt-6'>
          <div className='flex items-center justify-center bg-blue-600 text-white text-xl font-semibold rounded-2xl shadow-md h-[120px] transition-all duration-300'>
            Cadastrar Encomenda
          </div>
        </div>
        <div className='flex justify-center mt-6 px-4'>
          <div className='bg-white shadow-md rounded-2xl px-8 pt-6 pb-8 w-full max-w-md'>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='remetente'
                >
                  Remetente:
                </label>
                <input
                  className='shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                  id='remetente'
                  type='text'
                  placeholder='Nome do Remetente'
                  value={remetente}
                  onChange={(e) => setRemetente(e.target.value)}
                  required
                />
              </div>
              <div className='mb-6'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='moradorId'
                >
                  Destinatário (Morador):
                </label>
                <select
                  className='shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                  id='moradorId'
                  value={moradorId}
                  onChange={(e) => setMoradorId(e.target.value)}
                  required
                >
                  <option value='' disabled>
                    Selecione um morador
                  </option>
                  {listaMoradores.map((morador) => (
                    <option key={morador.id} value={morador.id}>
                      {morador.nome}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md'
                type='submit'
              >
                Cadastrar Encomenda
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroEncomenda;
