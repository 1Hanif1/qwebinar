import { Button } from "@/components/ui/button";
import { useHostContext } from "@/contexts/HostContext";
import { deleteRoomAction } from "@/lib/actions";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

const APP_URL = "http://localhost:3000";

function RoomCard({ hostName, hostId, room, room_number }) {
  const { revalidate } = useHostContext();
  const { title, isActive, code, id: roomId } = room;
  const [formStatus, FormAction, isPending] = useActionState(
    deleteRoomAction,
    null
  );
  useEffect(
    function () {
      if (formStatus === null || isPending) return;
      if (formStatus) {
        toast.success("Room Deleted!");
        revalidate();
      } else {
        toast.error("Could not delete room");
      }
    },
    [formStatus, isPending]
  );

  async function shareHandler() {
    console.log(window.location.href);
    const text = `Room: ${title},\nHost: ${hostName},\nRoom Code: ${code
      .split("-")
      .slice(1, 3)
      .join("-")}\nLink: ${APP_URL}/room?code=${code
      .split("-")
      .slice(1, 3)
      .join("-")}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("details copied");
    } catch {
      toast.error("could not copy details");
    }
  }

  return (
    <a href="#" className="group relative block h-64 sm:h-80 lg:h-96">
      <span className="absolute inset-0 border-2 border-dashed border-black group-hover:border-primary"></span>

      <div className="relative flex h-full transform items-end border-2 border-black bg-white transition-transform group-hover:border-primary group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
          <span className="absolute top-5 left-5 block w-fit mb-4 text-xs py-1 px-6 text-white bg-green-500 rounded-full">
            Active
          </span>
          <h1 className="text-4xl font-bold">ROOM #{room_number}</h1>
          <h2 className="mt-4 text-xl font-medium sm:text-2xl">{room.title}</h2>
        </div>

        <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
          <h3 className="mt-4 text-xl font-medium sm:text-2xl">{room.title}</h3>

          <p className="my-4 text-sm sm:text-base">
            Here goes information about the room. Maybe the total attendees
            allowed, questions asked and stuff.
          </p>

          <div className="grid grid-cols-2 justify-stretch gap-4">
            <Button
              className={`${isActive ? "opacity-50 bg-secondary" : ""}`}
              disabled={isActive}
            >
              {isActive ? "Active" : "Activate"}
            </Button>
            <Button onClick={shareHandler}>Share</Button>
            <Button>View</Button>
            <form action={FormAction} className="block w-full">
              <input type="hidden" name="roomId" defaultValue={roomId} />
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-900 text-white w-full"
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </a>
  );
}

function Rooms({ user }) {
  const { full_name: name, rooms, id } = user;
  return (
    <div className="w-full p-10 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
      {/* <div className="p-6 border rounded-lg">
        <h2 className="font-bold text-3xl">ROOM NAME</h2>
        <div className="my-5 flex flex-col gap-4">
          <p>Max Attendees: X</p>
          <p>Questions Asked: X</p>
        </div>
        <div className="flex flex-wrap justify-stretch gap-4">
          <Button
            className={`${isActive ? "opacity-50 bg-secondary" : ""}`}
            disabled={isActive}
          >
            {isActive ? "Active" : "Activate"}
          </Button>
          <Button>Share</Button>
          <Button>View</Button>
          <Button>Delete</Button>
        </div>
      </div> */}
      {rooms.map((room, index) => (
        <RoomCard
          hostName={name}
          hostId={id}
          key={index}
          room_number={index + 1}
          room={room}
        />
      ))}
    </div>
  );
}

export default Rooms;
