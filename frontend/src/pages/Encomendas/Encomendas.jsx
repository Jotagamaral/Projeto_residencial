import React from 'react';
import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import EncomendasList from "../../components/EncomendasList";
import { buscarEncomendas } from "../../services/encomendasService";
import { useNavigate } from "react-router-dom";

function Encomendas() {

    const [encomendas, setEncomendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      async function carregarEncomendas() {
        try {
          const dados = await buscarEncomendas();
          setEncomendas(dados);
        } catch (error) {
          setErro("Erro ao carregar encomendas.");
        } finally {
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
              <div className="mt-10 px-8 w-full max-w-4xl">
                {loading && <p>Carregando Encomendas...</p>}
                {!loading && erro && <p className="text-red-500">{erro}</p>}
                {!loading && !erro && <EncomendasList encomendas={encomendas} />}
              </div>
            </div>
            {/* Botão fixo no canto inferior direito */}
            <button
              className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 text-lg rounded-xl flex items-center justify-center gap-3 focus:outline-none focus:shadow-outline z-50"
              onClick={() => navigate("/cadastro_encomendas")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19" strokeWidth="3" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span className="flex items-center justify-center text-xl font-bold">Nova encomenda</span>
            </button>
          </div>
        </div>
      );
}

export default Encomendas;