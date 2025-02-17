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

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSignIn = () => {
    if (!email || !password) setError("Please enter valid email and password");
    // Handle sign-in logic here
    console.log(error);
    console.log("Sign In", { email, password });
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
          <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={"/auth/signup"}
              className="underline text-primary font-bold"
            >
              Sign up
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
          <div className="text-red-400">Error message goes here</div>
        </CardBody>

        <CardFooter>
          <Button onClick={handleSignIn} className="w-full">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
