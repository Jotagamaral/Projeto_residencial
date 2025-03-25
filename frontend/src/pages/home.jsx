import React from "react";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-blue-600 text-white flex flex-col justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold italic">Condosync</h1>
          <ul className="mt-8 space-y-4">
            <li className="cursor-pointer">HOME</li>
            <li className="cursor-pointer">PERFIL</li>
          </ul>
        </div>
        <div>
          <button className="w-full bg-red-500 py-2 rounded">SAIR</button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
       
        <div className="bg-gray-200 p-4 text-center text-lg font-semibold">
          Nome do condomínio
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-500 text-white p-6 rounded text-center">Reclamações</div>
          <div className="bg-blue-500 text-white p-6 rounded text-center">Reservas</div>
          <div className="bg-blue-500 text-white p-6 rounded text-center flex flex-col">
            <span>Avisos</span>
            <div className="bg-gray-300 text-black p-4 mt-2 rounded">Descrição:</div>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded text-center flex flex-col">
            <span>Encomendas</span>
            <div className="bg-gray-300 text-black p-4 mt-2 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
