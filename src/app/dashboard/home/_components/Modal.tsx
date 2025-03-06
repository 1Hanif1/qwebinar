"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/Spinner";
import { createRoomAction } from "@/lib/actions";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

interface CreateRoomModalProps {
  isPremiumUser: boolean;
  showModal: (visible: boolean) => void;
  hostId: number;
}

export default function CreateRoomModal({
  isPremiumUser = false,
  showModal,
  hostId = -1,
}: CreateRoomModalProps) {
  const [formStatus, FormAction, isPending] = useActionState(
    createRoomAction,
    null
  );
  useEffect(
    function () {
      if (formStatus === null) return;
      if (formStatus === true) {
        toast.success("Room was created");
      } else {
        toast.error("Could not create room");
      }
      showModal(false);
    },
    [formStatus, showModal]
  );
  return (
    <>
      <div className="absolute bg-slate-300/25 backdrop-blur-sm top-0 left-0 w-full h-screen flex justify-center items-center">
        {isPending ? (
          <Spinner />
        ) : (
          <form className="bg-white p-10 rounded-xl" action={FormAction}>
            <h1 className="text-2xl font-bold tracking-wide">
              Create A New Room
            </h1>
            <div className="my-6">
              <label id="room_name" className="font-bold">
                Room Name
              </label>
              <Input
                name="room_name"
                title="Room Name"
                placeholder="e.g amazing webinar"
                className="block mt-2"
                required
              />
            </div>
            <div className="my-6">
              <label id="num_of_attendees" className="font-bold">
                Number of Attendees
              </label>
              <Input
                type="number"
                name="num_of_attendees"
                title="Number of Attendees"
                placeholder="e.g 25"
                className="block mt-2"
                min={10}
                max={isPremiumUser ? undefined : 25}
                onChange={(e) => {
                  if (+e.target.value < 10) {
                    e.target.value = `10`;
                  }
                }}
                required
              />
            </div>
            <input type="hidden" name="host_id" defaultValue={hostId} />
            <div>
              <Button
                title="Create"
                className="w-full font-bold text-2xl py-4 mb-4"
              >
                Create
              </Button>
              <Button
                title="Create"
                className="w-full font-bold text-2xl py-4 bg-white border border-primary"
                onClick={(e) => {
                  e.preventDefault();
                  showModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
