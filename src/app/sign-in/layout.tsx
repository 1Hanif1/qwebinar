import { Suspense } from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProviderWrapper from "@/utils/SessionProviderWrapper";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getServerSession(authOptions);
  return (
    <Suspense>
      <div className="flex h-screen flex-col items-center justify-between gap-8 py-8 mx-4">
        <Logo />
        <SessionProviderWrapper session={session}>
          <div className="w-full max-w-md">{children}</div>
        </SessionProviderWrapper>
        <div>
          <p className="text-sm w-full max-w-md">
            By proceeding you acknowledge that you have read, understood and
            agree to our{" "}
            <Link href="/legal/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </Suspense>
  );
}
