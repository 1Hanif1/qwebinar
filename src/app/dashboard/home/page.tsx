"use client";
import { useHostContext } from "@/contexts/HostContext";
import Header from "./_components/Header";
import { useSession } from "next-auth/react";
import Spinner from "@/components/ui/Spinner";
import { useEffect } from "react";
import Rooms from "./_components/Rooms";

export default function Page() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  if (!email) throw new Error("Something went wrong");
  const { host, getHostData, isLoading } = useHostContext();
  useEffect(() => {
    if (host?.full_name === "%NAME%") getHostData(email);
  }, [email, host]);

  if (isLoading)
    return (
      <section className="w-full">
        <Spinner />
      </section>
    );

  return (
    <section className="w-full h-full z-0">
      <Header user={host} />
      <Rooms user={host} />
    </section>
  );
}
