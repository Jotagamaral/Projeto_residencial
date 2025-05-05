import React from 'react';
import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import EncomendasList from "../../components/EncomendasList"; // importar o novo componente
import { buscarEncomendas } from "../../services/encomendasService"; // importar o serviço

function Encomendas() {

    const [encomendas, setEncomendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
      async function carregarEncomendas() {
        try {
          const dados = await buscarEncomendas();
          console.log("Dados na encomenda.jsx:", dados);
          setEncomendas(dados);
        } catch (error) {
          setErro("Erro ao carregar encomendas.");
        } finally {
          console.log("Dados na encomenda final:", encomendas);
          setLoading(false);
        }
      }
      carregarEncomendas();
    }, []);

    return (
        <div className="flex bg-gray-100 min-h-screen">
          <CustomSidebar />
          <div className="w-full">
            <Navbar />
            <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="mt-10 px-8">
                {loading && <p>Carregando Encomendas...</p>}
                {erro && <p className="text-red-500">{erro}</p>}
                {!loading && !erro && <EncomendasList encomendas={encomendas} />}
            </div>
            </div>
          </div>
        </div>
      );
    }

export default Encomendas;

/*return (
    <div className="flex bg-gray-100 min-h-screen">
      <CustomSidebar />
      <div className="w-full">
        <Navbar />
        <div className="w-full flex flex-col items-center justify-center py-8">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-4xl">
            <h2 className="text-gray-700 text-xl font-bold mb-6 text-center">
              Encomendas Registradas
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
                    <th className="py-2 px-4 border">Remetente</th>
                    <th className="py-2 px-4 border">Destinatário</th>
                    <th className="py-2 px-4 border">Apartamento</th>
                    <th className="py-2 px-4 border">Hora da Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {encomendas.map((item) => (
                    <tr key={item.id} className="text-center border-t">
                      <td className="py-2 px-4 border">{item.remetente}</td>
                      <td className="py-2 px-4 border">{item.destinatario}</td>
                      <td className="py-2 px-4 border">{item.apartamento}</td>
                      <td className="py-2 px-4 border">{item.hora_entrega}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Encomendas;*/
