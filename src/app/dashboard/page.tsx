import { redirect } from "next/navigation";

async function page() {
  // const session = await auth();
  // if (!session) return redirect("/sign-in");
  redirect("/dashboard/home");
}

export default page;
