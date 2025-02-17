// import Spinner from "@/components/ui/Spinner";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth");
  // return (
  //   <>
  //     <Spinner />
  //   </>
  // );
}
