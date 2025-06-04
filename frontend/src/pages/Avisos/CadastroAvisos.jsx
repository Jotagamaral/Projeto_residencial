import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';

function CadastroAvisos() {
  const [aviso, setAviso] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você faria o POST para o backend
    setAviso('');
    setData('');
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CustomSidebar />
      <div className="w-full">
        <Navbar />
        <div className="w-full flex flex-col items-center justify-center py-8">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-xl">
            <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
              Cadastrar Aviso
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aviso">
                  Aviso:
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
                  id="aviso"
                  placeholder="Digite o aviso"
                  value={aviso}
                  onChange={(e) => setAviso(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data">
                  Data:
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
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Cadastrar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroAvisos;