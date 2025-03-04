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
        <SidebarGroupLabel className="my-4">
          <a
            href="#"
            className="relative flex items-center gap-2 w-full bg-white p-4 "
          >
            <Image
              alt="Avatar"
              src={image}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />

            <div>
              <p className="text-xs">
                <strong className="block font-medium">{name}</strong>

                <span className="block w-full overflow-scroll">{email}</span>
              </p>
            </div>
          </a>
        </SidebarGroupLabel>
      </SidebarFooter>
    </Sidebar>
  );
}
