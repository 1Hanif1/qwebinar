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

const SignInPage: React.FC = () => {
  const [textContent, setTextContent] = useState("");
  const [timer, setTimer] = useState(0);

  // ✅ Ensure this only runs on the client-side
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR errors

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

  const handleAskQuestion = function () {
    if (!textContent) return toast.error("Please ask a question");
    setTimer(60);

    // ✅ Ensure localStorage only runs on the client
    if (typeof window !== "undefined") {
      localStorage.setItem("timer", Math.floor(Date.now() / 1000));
    }
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
            Ask your Questions!
          </TextEffect>
        </CardHeader>

        <CardBody>
          <div className="my-4">
            <label id="question" className="block mb-2 font-bold text-2xl">
              Question
            </label>
            <Textarea
              placeholder="Type your message here. Make sure it is descriptive"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required
            />
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

export default SignInPage;
