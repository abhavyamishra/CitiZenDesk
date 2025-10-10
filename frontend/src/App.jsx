import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import StatsDashboardPage from './pages/StatsDashboardPage'

import { SidebarInset } from "./components/ui/sidebar";
import { SidebarTrigger } from "./components/ui/sidebar";

import {AppSidebar} from "./components/app-sidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { AppRouter } from './routes/AppRoutes';
import { UserPage } from './pages/UserPage';
import { Button } from "./components/ui/button";
import { ChevronDown, Plus, ChevronUp } from 'lucide-react';



function App() {
  // Now, each complaint has a location AND a weight for its severity.
  
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
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
              <Button variant="ghost" size="sm" onClick={() => setIsStatsVisible(!isStatsVisible)}>
                            Stats
                            
                            {isStatsVisible ? (
                                <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ChevronDown className="ml-2 h-4 w-4" />
                            )}
              </Button>   
            {role === 'user' && (
  <div>
    <Button asChild variant="default" size="sm">
      <Link to="/complaint/new">
        <Plus className="mr-2 h-4 w-4" /> Create Complaint
      </Link>
    </Button>
  </div>
)}
</div>
        </header>
      {isStatsVisible && (
                        <StatsDashboardPage />
                    )}

        <main className="flex items-center gap-2 px-4">
          <UserPage/>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;

