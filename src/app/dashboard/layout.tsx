import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/features/dashboard/AppSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/utils/SessionProviderWrapper";
import HostProviderWrapper from "@/utils/HostProviderWrapper";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  return (
    <>
      <SessionProviderWrapper session={session}>
        <HostProviderWrapper>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen overflow-y-auto min-h-screen">
              <div className="w-full text-center p-3 text-xs bg-gray-200">
                This application is in Beta, so not all features work and there
                may be issues ocassionally 😓
              </div>
              <SidebarTrigger className="md:hidden" />
              {children}
            </main>
          </SidebarProvider>
        </HostProviderWrapper>
      </SessionProviderWrapper>
    </>
  );
}
