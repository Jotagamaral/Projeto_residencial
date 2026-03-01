import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaComments,
  FaCalendarAlt,
  FaBox,
  FaBullhorn,
  FaSignOutAlt,
  FaBuilding,
  FaChevronRight,
} from 'react-icons/fa';

const navItems = [
  { title: 'Home', href: '/home', icon: FaHome },
  { title: 'Reclamacoes', href: '/reclamacoes', icon: FaComments },
  { title: 'Reservas', href: '/reservas', icon: FaCalendarAlt },
  { title: 'Encomendas', href: '/encomendas', icon: FaBox },
];

function CustomSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [tipoCargo, setTipoCargo] = useState('');
  const [userName, setUserName] = useState('Morador');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setTipoCargo(userObject.categoria);
        if (userObject.nome) setUserName(userObject.nome);
      } catch (e) {
        console.error("Erro ao parsear dados do usuario do localStorage:", e);
      }
    }
  }, []);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="min-h-screen w-64 bg-[#1a1f3d] text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6">
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500">
            <FaBuilding className="text-white text-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">CondoSync</span>
            <span className="text-[11px] text-white/50">Residencial Trindades</span>
          </div>
        </Link>
      </div>

      {/* Separator */}
      <div className="mx-5 h-px bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.title}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="text-base" />
                  <span>{item.title}</span>
                  {isActive && (
                    <FaChevronRight className="ml-auto text-[10px] opacity-60" />
                  )}
                </Link>
              </li>
            );
          })}
          {tipoCargo === "FUNCIONARIO" && (
            <li>
              <Link
                to="/cadastro_aviso"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/cadastro_aviso'
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FaBullhorn className="text-base" />
                <span>Novos avisos</span>
                {location.pathname === '/cadastro_aviso' && (
                  <FaChevronRight className="ml-auto text-[10px] opacity-60" />
                )}
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 pb-5">
        <div className="h-px bg-white/10 mb-4" />
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-semibold text-indigo-300">
            {initials}
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-xs font-medium text-white truncate">{userName}</span>
            <span className="text-[10px] text-white/40">Morador</span>
          </div>
          <button
            onClick={logout}
            className="flex size-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Sair"
          >
            <FaSignOutAlt className="text-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CustomSidebar;
