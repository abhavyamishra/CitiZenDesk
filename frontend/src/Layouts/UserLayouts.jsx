import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "your-sidebar-library";
import AppSidebar from "./AppSidebar";

const UserLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 bg-sidebar text-sidebar-foreground transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>

          <div className="ml-auto flex items-center gap-6 pr-4">
            <div>About us</div>
            <div>Contact us</div>
          </div>
        </header>

        <main className="flex items-center gap-2 px-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UserLayout;
