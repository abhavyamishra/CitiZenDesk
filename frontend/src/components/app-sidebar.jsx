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




export function AppSidebar() {

  const authState = useSelector(state => state.auth);

let isUserSignedIn = authState.isAuthenticated && authState.role === "user";

const data = {
  user: {
    name: authState.id,
    email: authState.email,
    locality: authState.locality,
    imageUrl: authState.avatar
  },
  teams: [
    {
      name: "CitiZenDesk",
      logo: "group.png",
      plan: "Enterprise",
    },
  ],

  municipalStaff: {
    name: authState.id,
    email: authState.email,  
    department: authState.dept,
    imageUrl: authState.avatar
  },

  // navMain: {
  //   common: {
  //     title: "Your Profile",
  //     url: "#",
  //     icon: SquareTerminal,
  //     isActive: true,
  //     items: [
  //       {
  //         title: "View Profile",
  //         url: "#",
  //       },
  //       {
  //         title: "Change Password",
  //         url: "#",
  //       },
  //       {
  //         title: "Change Aavatar",
  //         url: "#",
  //       },
        
  //       ...(authState.role === 'user' ? [{ title: "Change Locality", url: "#" }] : [])
  //     ],
  //   },
  //   onlyUser:{
  //     title: "Complaints",
  //     url: "#",
  //     icon: Bot,
  //     items: [
  //       {
  //         title: "Your Complaints",
  //         url: "#",
  //       },
  //       {
  //         title: "Create Complaint",
  //         url: "#",
  //       },
  //       {
  //         title: "Give Feedback",
  //         url: "#",
  //       },
  //     ],
  //   },
    
  // },
}

// Ye maan kar chal rahe hain ki authState component ke scope mein available hai
// For example: const authState = useSelector(state => state.auth);

const navMain = {
  common: {
    title: "Your Profile",
    url: "#", // Parent ka URL '#' hi rahega kyunki ye sirf container hai
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "View Profile",
        url: `/profile/${authState.id}`, // <-- Change: Dynamic URL for user profile
      },
      {
        title: "Change Password",
        url: `/profile/${authState.id}/change-password`, // <-- Change
      },
      {
        title: "Change Avatar",
        url: `/profile/${authState.id}/change-avatar`, // <-- Change
      },
      // Ye user role ke liye conditionally add ho jayega
      ...(authState.role === 'user' ? [{ title: "Change Locality", url: `/profile/${authState.id}/change-locality` }] : []) // <-- Change
    ],
  },
  onlyUser: {
    title: "Complaints",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Your Complaints",
        // Hum URL mein query parameter ka istemal karenge tab ko control karne ke liye
        url: "/dashboard?tab=user", // <-- IMPORTANT CHANGE
      },
      {
        title: "Create Complaint",
        url: "/complaint/new", // <-- Change
      },
      {
        title: "Give Feedback",
        url: "/feedback", // <-- Change (Aap isko apne feedback page ke URL se badal sakte hain)
      },
    ],
  },
};

  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {isUserSignedIn ? <NavMain items={[navMain.common, navMain.onlyUser]} /> : <NavMain items={[navMain.common]} />}

       {isUserSignedIn ? <NavProjects /> : null}

      </SidebarContent>
      <SidebarFooter>
        {isUserSignedIn ? <NavUser user={data.user} /> : <NavUser user={data.municipalStaff} />}
      
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
