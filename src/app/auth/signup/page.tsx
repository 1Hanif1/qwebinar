"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent as CardBody,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BorderTrail } from "@/components/ui/border-trail";
import { TextEffect } from "@/components/ui/text-effect";

export function TextEffectPerWord() {
  return (
    <TextEffect per="word" as="h3" preset="blur">
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // Handle sign-up logic here
    console.log("Sign Up", { email, password, confirmPassword });
  };

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
            className="text-2xl font-bold"
          >
            Get Started 💪
          </TextEffect>
          <p>
            already have an account?{" "}
            <Link
              href={"/auth/signin"}
              className="underline text-primary font-bold"
            >
              Sign in
            </Link>
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div>
        </CardBody>
        <CardFooter>
          <Button onClick={handleSignUp} className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
