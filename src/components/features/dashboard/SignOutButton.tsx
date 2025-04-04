"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <Button
      className="block w-full bg-secondary font-bold"
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
    >
      Log out
    </Button>
  );
}
