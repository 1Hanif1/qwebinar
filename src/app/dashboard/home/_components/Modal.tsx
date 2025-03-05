"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoomAction } from "@/lib/actions";

interface CreateRoomModalProps {
  visible: boolean;
  isPremiumUser: boolean;
  showModal: (visible: boolean) => void;
  hostId: number;
}

export default function CreateRoomModal({
  visible = false,
  isPremiumUser = false,
  showModal,
  hostId = -1,
}: CreateRoomModalProps) {
  if (!visible) return <></>;
  return (
    <div className="absolute bg-slate-300/25 backdrop-blur-sm top-0 left-0 w-full h-screen flex justify-center items-center">
      <form className="bg-white p-10 rounded-xl" action={createRoomAction}>
        <h1 className="text-2xl font-bold tracking-wide">Create A New Room</h1>
        <div className="my-6">
          <label id="room_name" className="font-bold">
            Room Name
          </label>
          <Input
            name="room_name"
            title="Room Name"
            placeholder="e.g amazing webinar"
            className="block mt-2"
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
    </div>
  );
}
