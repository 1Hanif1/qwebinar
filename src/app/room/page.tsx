"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent as CardBody,
} from "@/components/ui/card";

import { BorderTrail } from "@/components/ui/border-trail";

import { TextEffect } from "@/components/ui/text-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { joinRoomAction } from "@/lib/actions";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignInPage: React.FC = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [roomCode, setRoomCode] = useState(code ? code : "");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const handleRoomJoin = async function () {
    if (!userName) return toast.error("Enter a valid name");
    if (!emailRegex.test(email)) return toast.error("Enter a valid email");
    const response = await joinRoomAction({
      code: roomCode,
      name: userName,
      email
    });
    if (!response.status)
      return toast.error(response.error || "Something went wrong");
    localStorage.setItem("qwebinar_room_code", roomCode);
    localStorage.setItem("qwebinar_attendee", userName);
    localStorage.setItem("qwebinar_attendee_email", email);
    redirect("/room/live");
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
            className="text-4xl text-center font-bold"
          >
            Enter details
          </TextEffect>
        </CardHeader>

        <CardBody>
          <div className="my-4">
            <label id="attendee_name" className="mb-2">
              Your Name
            </label>
            <Input
              name="attendee_name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              required
            />
          </div>
          <div className="my-4">
            <label id="attendee_email" className="mb-2">
              Email
            </label>
            <Input
              name="attendee_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="my-4">
            <label id="room_code" className="mb-2">
              Room Code
            </label>
            <Input
              name="room_code"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              required
            />
          </div>
          <Button onClick={handleRoomJoin} className="block w-full">
            JOIN
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignInPage;
