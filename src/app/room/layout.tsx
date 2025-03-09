import { Suspense } from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="flex h-screen flex-col items-center justify-between gap-8 py-8 mx-4">
        <Logo />
        <div className="w-full max-w-md">{children}</div>
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
