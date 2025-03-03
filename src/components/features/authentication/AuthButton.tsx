"use client";
import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

function AuthButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="flex justify-center items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium w-full"
    >
      <Image
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google logo"
        height="24"
        width="24"
      />
      <span>Continue with Google</span>
    </button>
  );
}

export default AuthButton;
