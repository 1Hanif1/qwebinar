import { getServerSession } from "next-auth";
import Header from "./_components/Header";
import { authOptions } from "@/lib/auth";
import { getHost } from "@/lib/data-service";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("Something went wrong, please login again");
  const host = await getHost({ email });
  return (
    <section className="w-full">
      <Header user={host} />
    </section>
  );
}
