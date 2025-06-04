import React from 'react';
import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import ReservasList from "../../components/ReservasList"; // importar o novo componente
import { buscarReservas } from "../../services/reservasService"; // importar o serviço
import { useNavigate } from "react-router-dom";

function Reservas () {

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      async function carregarReservas() {
        try {
          const dados = await buscarReservas();
          console.log("Dados na reservas.jsx:", dados);
          setReservas(dados);
        } catch (error) {
            console.error(error)
            setErro("Erro ao carregar reservas.");
        } finally {
          console.log("Dados na reserva final:", reservas);
          setLoading(false);
        }
      }
      carregarReservas();
    }, []);

    return (
        <div className="flex bg-gray-100 min-h-screen">
          <CustomSidebar />
          <div className="w-full">
            <Navbar />
            <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="mt-10 px-8">
                {loading && <p>Carregando Reservas...</p>}
                {!loading && erro && <p className="text-red-500">{erro}</p>}
                {!loading && !erro && <ReservasList reservas={reservas} />}
            </div>
            </div>
            <button
              className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 text-lg rounded-xl flex items-center justify-center gap-3 focus:outline-none focus:shadow-outline z-50"
              onClick={() => navigate("/cadastro_reserva")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19" strokeWidth="3" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span className="flex items-center justify-center text-xl font-bold">Nova reserva</span>
            </button>
          </div>
        </div>
      );
    }

export default Reservas;

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
