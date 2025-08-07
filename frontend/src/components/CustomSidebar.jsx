import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function CustomSidebar() {
  const { logout } = useAuth();
  const [tipoCargo, setTipoCargo] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setTipoCargo(userObject.categoria);
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
      }
    }
  }, []);

  return (
    <aside className="min-h-screen bg-blue-600 text-white flex flex-col p-4">
      <div className="text-white text-center mb-6">
        <span className="self-center whitespace-nowrap text-2xl font-bold">
          CondoSync
        </span>
      </div>

      <ul className="space-y-2 font-medium flex-1">
        <li>
          <Link to="/" className="flex items-center p-2 rounded-lg text-white hover:bg-blue-500">
            Home
          </Link>
        </li>
        <li>
          <Link to="/reclamacoes" className="flex items-center p-2 rounded-lg text-white hover:bg-blue-500">
            Reclamações
          </Link>
        </li>
        <li>
          <Link to="/reservas" className="flex items-center p-2 rounded-lg text-white hover:bg-blue-500">
            Reservas
          </Link>
        </li>
        <li>
          <Link to="/encomendas" className="flex items-center p-2 rounded-lg text-white hover:bg-blue-500">
            Encomendas
          </Link>
        </li>
        {tipoCargo === "FUNCIONARIO" && (
          <li>
            <Link to="/cadastro_aviso" className="flex items-center p-2 rounded-lg text-white hover:bg-blue-500">
              Novos avisos
            </Link>
          </li>
        )}
      </ul>

      <ul className="pt-4 mt-4 border-t border-gray-200">
        <li>
          <button onClick={logout} className="flex w-full items-center p-2 rounded-lg text-white hover:bg-blue-500">
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default CustomSidebar;