import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';

function CadastroReclamacao() {
  const [textoReclamacao, setTextoReclamacao] = useState('');
  const [nomeMorador, setNomeMorador] = useState('');
  const [anonimo, setAnonimo] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const reclamacoesData = {
      textoReclamacao: textoReclamacao,
      nomeMorador: anonimo ? 'Anônimo' : nomeMorador
    };
    console.log('Dados da reclamação para enviar:', reclamacoesData);
    setTextoReclamacao('');
    setNomeMorador('');
    setAnonimo(false);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
        <CustomSidebar />
        <div className="w-full">
            <Navbar />
            <div className="w-full flex flex-col items-center justify-center py-8">
                <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md ">
                    <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center ">
                    Cadastrar Reclamação
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textoReclamacao">
                                Reclamação:
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
                                id="textoReclamacao"
                                placeholder="Texto da Reclamação"
                                value={textoReclamacao}
                                onChange={(e) => setTextoReclamacao(e.target.value)}
                                required
                                rows={4}
                            />
                        </div>
                    <div className="mb-4 flex items-center">
                        <input
                            id="anonimo"
                            type="checkbox"
                            checked={anonimo}
                            onChange={() => setAnonimo(!anonimo)}
                            className="mr-2"
                        />
                        <label htmlFor="anonimo" className="text-gray-700 text-sm font-bold">
                        Reclamação anônima
                        </label>
                    </div>
                    {!anonimo && (
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nomeMorador">
                            Nome do Morador:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="nomeMorador"
                            type="text"
                            placeholder="Nome do Morador"
                            value={nomeMorador}
                            onChange={(e) => setNomeMorador(e.target.value)}
                            required={!anonimo}
                        />
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        >
                        Cadastrar Reclamação
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}

export default CadastroReclamacao;