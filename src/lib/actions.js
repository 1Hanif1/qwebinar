"use server";
import { signIn, signOut } from "./auth";

export async function SignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function SignOutAction() {
  await signOut({ redirectTo: "/auth" });
}
