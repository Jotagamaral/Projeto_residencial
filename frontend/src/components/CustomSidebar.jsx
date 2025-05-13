import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react";

function CustomSidebar() {
  return (
    <div>
      <Sidebar className="h-screen bg-blue-600 text-white">
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
          </SidebarItemGroup>
        </SidebarItems>
        
        <SidebarItemGroup>
          <SidebarItem href="/perfil" className="text-gray-900 hover:bg-gray-200">
            Perfil
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem href="/login" className="text-gray-900 hover:bg-gray-200">
            Logout
          </SidebarItem>

          {/*
          <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
            Logout
          </SidebarItem>
            */}

        </SidebarItemGroup> 
      </Sidebar>

    </div>
  );
}

export default CustomSidebar;
