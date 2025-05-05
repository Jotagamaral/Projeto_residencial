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
            <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
              About
            </SidebarItem>
            <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
              Services
            </SidebarItem>
            <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
              Contact
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
        
        <SidebarItemGroup>
          <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
            FAQ
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
            Settings
          </SidebarItem>
          <SidebarItem href="/" className="text-gray-900 hover:bg-gray-200">
            Logout
          </SidebarItem>
        </SidebarItemGroup> 
      </Sidebar>

    </div>
  );
}

export default CustomSidebar;
