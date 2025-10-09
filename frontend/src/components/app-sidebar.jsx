"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useSelector } from "react-redux"
import { Nav } from "react-day-picker"

const authState = useSelector(state => state.auth);

let isUserSignedIn = authState.isAuthenticated && authState.role === "user";

const data = {
  user: {
    name: state.auth.id,
    email: state.auth.email,
    locality: state.auth.locality,
    imageUrl: state.auth.avatar
  },
  teams: [
    {
      name: "CitiZenDesk",
      logo: "group.png",
      plan: "Enterprise",
    },
  ],

  municipalStaff: {
    name: state.auth.id,
    email: state.auth.email,  
    department: state.auth.dept,
    imageUrl: state.auth.avatar
  },

  navMain: {
    common: {
      title: "Your Profile",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "View Profile",
          url: "#",
        },
        {
          title: "Change Password",
          url: "#",
        },
        {
          title: "Change Aavatar",
          url: "#",
        },
        
        (state.auth.role === 'user'? [{ title: "Change Locality", url: "#" }]: []
        )
      ],
    },
    onlyUser:{
      title: "Complaints",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Your Complaints",
          url: "#",
        },
        {
          title: "Create Complaint",
          url: "#",
        },
        {
          title: "Give Feedback",
          url: "#",
        },
      ],
    },
    
  },
}


export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {isUserSignedIn ? <NavMain items={[data.navMain.common, data.navMain.onlyUser]} /> : <NavMain items={[data.navMain.common]} />}

       {isUserSignedIn ? <NavProjects /> : null}

      </SidebarContent>
      <SidebarFooter>
        {isUserSignedIn ? <NavUser user={data.user} /> : <NavUser user={data.municipalStaff} />}
      
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
