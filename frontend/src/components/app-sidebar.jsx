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


let isUserSignedIn = true;

const data = {
  user: {
    name: "Abhavya Mishra",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CitiZenDesk",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
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
        {
          title: "Change Name",
          url: "#",
        },
      ],
    },
    {
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
    
  ],
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
        <NavMain items={data.navMain} />
       {isUserSignedIn ? <NavProjects /> : null}

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
