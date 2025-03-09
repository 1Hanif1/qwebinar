import { Home, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/components/ui/logo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import SignOutButton from "./SignOutButton";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export async function AppSidebar() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name;
  const email = session?.user?.email;
  const image = session?.user?.image;
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel className="my-4">
          <Logo />
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupLabel className="flex flex-col mb-24 w-full">
          <div className="flex items-center gap-2 w-full bg-white p-4 mb-2">
            <Image
              alt="Avatar"
              src={image || "/default-avatar.jpg"}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />

            <div className="overflow-hidden">
              <p className="text-xs break-words">
                <strong className="block font-medium truncate">{name}</strong>
                <span className="block w-full truncate">{email}</span>
              </p>
            </div>
          </div>
          <SignOutButton />
        </SidebarGroupLabel>
      </SidebarFooter>
    </Sidebar>
  );
}
