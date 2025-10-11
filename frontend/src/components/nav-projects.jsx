"use client"

import * as React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction
} from "@/components/ui/sidebar";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider"

export function NavProjects({ isUserSignedIn=true }) {
  const { theme, setTheme } = useTheme()

  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  // const toggleTheme = () => {
  // setTheme("light");
  // };


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {isUserSignedIn && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex justify-between items-center w-full">
                <span>Email Notifications</span>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                  <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300"></div>
              </label>


              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {/* {(isUserSignedIn &&
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex justify-between items-center w-full">
              <span>SMS Notifications</span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                type="checkbox"
                className="sr-only peer"
                checked={smsNotifications}
                onChange={() => setSmsNotifications(!smsNotifications)}
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300"></div>
              </label>

            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        )} */}

         {/* <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex justify-between items-center w-full">
              <span>Change Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1 border rounded px-2 py-1"
              >
                {isDarkTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {isDarkTheme ? "Dark" : "Light"}
              </button>
            </div>
          </SidebarMenuButton> 
         </SidebarMenuItem> */}
      </SidebarMenu> 
    </SidebarGroup>
  );
}

