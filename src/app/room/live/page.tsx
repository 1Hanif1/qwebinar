"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent as CardBody,
} from "@/components/ui/card";

import { BorderTrail } from "@/components/ui/border-trail";
import { TextEffect } from "@/components/ui/text-effect";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { askQuestionAction } from "@/lib/actions";

const Page: React.FC = () => {
  const room_code =
    typeof window !== "undefined"
      ? localStorage.getItem("qwebinar_room_code")
      : null;
  const attendee =
    typeof window !== "undefined"
      ? localStorage.getItem("qwebinar_attendee")
      : null;
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("qwebinar_attendee_email")
      : null;

  const [textContent, setTextContent] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR errors

    if (!room_code || !attendee || !email) return redirect("/room");

    const savedTime = localStorage.getItem("timer");

    if (!savedTime) return;

    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(savedTime);

    if (diff >= 60) {
      localStorage.removeItem("timer");
      setTimer(0);
      return;
    }

    setTimer(60 - diff);
  }, []);

  const handleAskQuestion = async function () {
    if (!textContent) return toast.error("Please ask a question");
    setTimer(60);

    // ✅ Ensure localStorage only runs on the client
    if (typeof window !== "undefined") {
      localStorage.setItem("timer", String(Math.floor(Date.now() / 1000)));
    }

    const room_code = localStorage.getItem("qwebinar_room_code");
    const attendee = localStorage.getItem("qwebinar_attendee");
    const email = localStorage.getItem("qwebinar_attendee_email");

    if (!room_code || !attendee || !email) return redirect("/room");

    const response = await askQuestionAction({
      question: textContent,
      code: room_code,
    });

    if (!response.status) return toast.error(response.error || "");

    setTextContent("");
    toast.success("Question Asked");
  };

  useEffect(() => {
    if (timer === 0) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("timer");
      }
      return;
    }

    const timeout = setTimeout(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer]);

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
            Ask your Question!
          </TextEffect>
        </CardHeader>

        <CardBody>
          <div className="my-4">
            <Textarea
              placeholder="Type your message here. Make sure it is descriptive"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required
            />
          </div>
          <div className="my-4">
            <div>{attendee}, keep your questions descriptive!</div>
            <div className="my-2">Email: {email}</div>
            <div>Room: {room_code}</div>
          </div>
          <Button
            disabled={timer !== 0}
            onClick={handleAskQuestion}
            className="block w-full"
          >
            {timer > 0 ? `Cooldown ${timer}s` : "ASK"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Page;
