import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaBuilding,
  FaChevronRight,
} from 'react-icons/fa';
import { menuStructure } from '../menu/menuStructure';

function CustomSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [tipoCargo, setTipoCargo] = useState('');
  const [userName, setUserName] = useState('Morador');
  const [expandedMenus, setExpandedMenus] = useState({});

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

  useEffect(() => {
    // Auto-expandir menus pai que possuem filhos com rotas ativas
    menuStructure.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => location.pathname === child.href);
        if (hasActiveChild) {
          setExpandedMenus((prev) => ({
            ...prev,
            [item.title]: true,
          }));
        }
      }
    });
  }, [location.pathname]);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const toggleSubmenu = (title) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="h-screen sticky top-0 w-64 bg-[#1a1f3d] text-white flex flex-col justify-between shrink-0 shadow-xl">
      {/* Container superior */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="px-5 py-6 shrink-0">
          <Link to="/home" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500 shadow-md shadow-indigo-500/20">
              <FaBuilding className="text-white text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">CondoSync</span>
              <span className="text-[11px] text-white/50">Residencial Trindades</span>
            </div>
          </Link>
        </div>

        <div className="mx-5 h-px bg-white/10 shrink-0" />

        {/* Links de navegação flexíveis com scroll interno se necessário */}
        <nav className="flex-grow px-3 py-4 overflow-y-auto min-h-0 custom-scrollbar">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Menu
          </p>
          <ul className="space-y-1">
            {menuStructure.map((item) => {
              // Se o item exigir papéis específicos e o usuário não possuir, oculta
              if (item.roles && !item.roles.includes(tipoCargo)) {
                return null;
              }

              // Renderização de menus colapsáveis com filhos
              if (item.children) {
                const isOpen = !!expandedMenus[item.title];
                const hasActiveChild = item.children.some((child) => location.pathname === child.href);

                return (
                  <li key={item.title} className="flex flex-col">
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 text-white/60 hover:bg-white/5 hover:text-white ${
                        hasActiveChild ? 'text-white font-semibold' : ''
                      }`}
                    >
                      <item.icon className="text-base shrink-0" />
                      <span className="flex-1 truncate">{item.title}</span>
                      <FaChevronRight
                        className={`text-[10px] opacity-60 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out pl-6 ${
                        isOpen ? 'max-h-40 opacity-100 py-1' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <ul className="space-y-1 border-l border-white/10 pl-2">
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.href;
                          return (
                            <li key={child.title}>
                              <Link
                                to={child.href}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  isChildActive
                                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <child.icon className="text-xs shrink-0" />
                                <span className="truncate">{child.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }

              // Renderização de itens simples
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
                    <item.icon className="text-base shrink-0" />
                    <span className="truncate">{item.title}</span>
                    {isActive && <FaChevronRight className="ml-auto text-[10px] opacity-60 shrink-0" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer - Colado de forma fixa na base da página */}
      <div className="px-5 pb-5 shrink-0 bg-[#1a1f3d]">
        <div className="h-px bg-white/10 mb-4" />
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-semibold text-indigo-300 animate-pulse">
            {initials}
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-xs font-medium text-white truncate">{userName}</span>
            <span className="text-[10px] text-white/40 truncate">
              {tipoCargo === 'ADMIN' ? 'Administrador' : tipoCargo === 'FUNCIONARIO' ? 'Funcionário' : 'Morador'}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex size-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white shrink-0"
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
