import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';

// Simulação de locais (poderia vir de uma API)
const locais = [
  { id: 1, nome: 'Salão de Festas' },
  { id: 2, nome: 'Churrasqueira' },
  { id: 3, nome: 'Quadra' }
];

// Simulação de reservas já cadastradas (substitua por busca real se necessário)
const reservasMock = [
  { id: 1, data: '2025-04-12', local_id: 1 },
  { id: 2, data: '2025-03-01', local_id: 3 },
  { id: 3, data: '2025-04-29', local_id: 2 }
];

function CadastroReservas() {
  const [data, setData] = useState('');
  const [localId, setLocalId] = useState('');
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    // Aqui você buscaria as reservas do backend
    setReservas(reservasMock);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const novaReserva = {
      id: reservas.length + 1,
      data,
      local_id: Number(localId)
    };
    // Aqui você faria o POST para o backend
    setReservas([...reservas, novaReserva]);
    setData('');
    setLocalId('');
  };

  // Função para pegar o nome do local pelo id
  const getNomeLocal = (id) => {
    const local = locais.find(l => l.id === id);
    return local ? local.nome : '';
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CustomSidebar />
      <div className="w-full">
        <Navbar />
        <div className="w-full flex flex-col items-center justify-center py-8">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-xl">
            <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
              Reservas já cadastradas
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
                    <th className="py-2 px-4 border">Data</th>
                    <th className="py-2 px-4 border">Local</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} className="text-center border-t">
                      <td className="py-2 px-4 border">{reserva.data}</td>
                      <td className="py-2 px-4 border">{getNomeLocal(reserva.local_id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
              Cadastrar Reserva
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data">
                  Data da Reserva:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="local">
                  Local:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="local"
                  value={localId}
                  onChange={(e) => setLocalId(e.target.value)}
                  required
                >
                  <option value="">Selecione o local</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>{local.nome}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Cadastrar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroReservas;