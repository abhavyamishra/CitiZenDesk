import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "your-sidebar-library";
import AppSidebar from "./AppSidebar";
import { Link } from "react-router-dom";


const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 bg-sidebar text-sidebar-foreground transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>

          <div className="ml-auto flex items-center gap-6 pr-4">
            <div>
              <Link 
              to="/about" 
              className="text-blue-600 hover:underline hover:text-blue-800"
              >
                About Us
              </Link>
            </div>
            <div>
              <Link
              to='/contact'
              className="text-blue-600 hover:underline hover:text-blue-800"
              >
                Contact us
              </Link>              
            </div>
          </div>
        </header>

        <main className="flex items-center gap-2 px-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
