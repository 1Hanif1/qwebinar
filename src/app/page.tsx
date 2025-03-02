// import Spinner from "@/components/ui/Spinner";
import Spinner from "@/components/ui/Spinner";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return (
    <>
      <Spinner />
    </>
  );
}
