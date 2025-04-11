import { Link } from "react-router-dom";
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
            <SidebarItem className="text-gray-900 hover:bg-gray-200">
              <Link>Home</Link>
            </SidebarItem>
            <SidebarItem className="text-gray-900 hover:bg-gray-200">
              <Link>About</Link>
            </SidebarItem>
            <SidebarItem className="text-gray-900 hover:bg-gray-200">
              <Link>Services</Link>
            </SidebarItem>
            <SidebarItem className="text-gray-900 hover:bg-gray-200">
              <Link>Contact</Link>
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
        
        <SidebarItemGroup>
          <SidebarItem className="text-gray-900 hover:bg-gray-200">
            <Link>FAQ</Link>
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem className="text-gray-900 hover:bg-gray-200">
            <Link>Settings</Link>
          </SidebarItem>
          <SidebarItem className="text-gray-900 hover:bg-gray-200">
            <Link>Logout</Link>
          </SidebarItem>
        </SidebarItemGroup> 
      </Sidebar>

    </div>
  );
}

export default CustomSidebar;
