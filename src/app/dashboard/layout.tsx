import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/features/dashboard/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full overflow-y-auto">
        <SidebarTrigger className="md:hidden" />
        {children}
      </main>
    </SidebarProvider>
  );
}
