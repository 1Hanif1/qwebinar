import { redirect } from "next/navigation";

async function page() {
  redirect("/dashboard/home");
}

export default page;
