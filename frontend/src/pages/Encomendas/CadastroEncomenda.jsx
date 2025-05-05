// pages/CadastroEncomenda.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';

function CadastroEncomenda() {
  const [remetente, setRemetente] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [apartamento, setApartamento] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você fará a chamada para o seu backend Spring Boot
    const encomendaData = {
      remetente: remetente,
      destinatario: destinatario,
      apartamento: apartamento,
      // Os outros campos (funcionario_id, morador_id, hora_entrega, id)
      // serão provavelmente gerenciados pelo backend.
    };
    console.log('Dados da encomenda para enviar:', encomendaData);
    // Limpar os campos após o envio (opcional)
    setRemetente('');
    setDestinatario('');
    setApartamento('');
  };


  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CustomSidebar />
        <div className="w-full">
        <Navbar />
        <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md ">
                <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center ">
                    Cadastrar Encomenda
                </h2>
                <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remetente">
                            Remetente:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="remetente"
                            type="text"
                            placeholder="Nome do Remetente"
                            value={remetente}
                            onChange={(e) => setRemetente(e.target.value)}
                            required
                        />
                        </div>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destinatario">
                            Destinatário:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="destinatario"
                            type="text"
                            placeholder="Nome do Destinatário"
                            value={destinatario}
                            onChange={(e) => setDestinatario(e.target.value)}
                            required
                        />
                        </div>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apartamento">
                            Apartamento:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="apartamento"
                            type="text"
                            placeholder="Número do Apartamento"
                            value={apartamento}
                            onChange={(e) => setApartamento(e.target.value)}
                            required
                        />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Cadastrar Encomenda
                            </button>
                        </div>
                </form>
                </div>
            </div>
        </div>
    </div>
  );
}

export default CadastroEncomenda;