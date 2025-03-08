"use client";
import { HostProvider } from "@/contexts/HostContext";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function HostProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session } = useSession();
  const email = session?.user?.email;
  if (!email) throw new Error("Something went wrong, please login again");

  return <HostProvider>{children}</HostProvider>;
}
