"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardContent as CardBody,
} from "@/components/ui/card";

import { BorderTrail } from "@/components/ui/border-trail";

import AuthButton from "@/components/features/authentication/AuthButton";
import { TextEffect } from "@/components/ui/text-effect";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const SignInPage: React.FC = () => {
  const { data: session } = useSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md relative">
        <BorderTrail
          style={{
            boxShadow:
              "0px 0px 60px 30px hsl(47.9 95.8% 53.1%), 0 0 100px 60px hsl(47.9 95.8% 53.1%), 0 0 140px 90px hsl(47.9 95.8% 53.1%)",
          }}
          size={100}
        />
        <CardHeader>
          <TextEffect
            per="word"
            as="h3"
            preset="blur"
            className="text-4xl text-center font-bold"
          >
            Welcome 👋
          </TextEffect>
        </CardHeader>

        <CardBody>
          <AuthButton />
        </CardBody>
      </Card>
    </div>
  );
};

export default SignInPage;
