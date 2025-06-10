import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react";
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";

function CustomSidebar() {
  const { logout } = useAuth();
  const [tipoCargo, setTipoCargo] = useState('')

  useEffect(() => {
  
        const userString = localStorage.getItem('user');
          if (userString) {
              try {
                  const userObject = JSON.parse(userString);
                  setTipoCargo(userObject.categoria)
                  
              } catch (e) {
                  console.error("Erro ao parsear dados do usuário do localStorage:", e);
              }
          }
      }, []);

  return (
    <div>
      <Sidebar className="min-h-screen bg-blue-600 text-white">
        <SidebarLogo href="/" className="text-white text-center mb-2">
        <span className="self-center whitespace-nowrap text-2xl font-bold">
          CondoSync
        </span>
        </SidebarLogo>
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
              Home
            </SidebarItem>
            <SidebarItem href="/reclamacoes" className="text-gray-900 hover:bg-gray-200">
              Reclamações
            </SidebarItem>
            <SidebarItem href="/reservas" className="text-gray-900 hover:bg-gray-200">
              Reservas
            </SidebarItem>
            <SidebarItem href="/encomendas" className="text-gray-900 hover:bg-gray-200">
              Encomendas
            </SidebarItem>
            {tipoCargo === "FUNCIONARIO" && (
              <SidebarItem href="/cadastro_aviso" className="text-gray-900 hover:bg-gray-200">
              Novos avisos
            </SidebarItem>
            )}
            
          </SidebarItemGroup>
        </SidebarItems>
        
        <SidebarItemGroup>
          <SidebarItem onClick={logout} className="text-gray-900 hover:bg-gray-200">
            Logout
          </SidebarItem>

        </SidebarItemGroup> 
      </Sidebar>

    </div>
  );
}

export default CustomSidebar;
