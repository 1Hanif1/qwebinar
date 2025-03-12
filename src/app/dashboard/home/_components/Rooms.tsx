import { Button } from "@/components/ui/button";
import { useHostContext } from "@/contexts/HostContext";
import { activateRoomAction, deleteRoomAction } from "@/lib/actions";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

const APP_URL = "http://localhost:3000";

function RoomSummaryModal({ data, closeModal }) {
  const { roomName, attendees, questionsAsked, aiSummary, questions } = data;
  return (
    <div className="bg-slate-500/20 backdrop-blur-3xl p-10 absolute w-full h-full z-10 flex justify-center">
      <div className="relative bg-white max-h-max p-10 w-1/2 rounded-2xl z-20">
        <span
          className="absolute right-10 cursor-pointer underline"
          onClick={closeModal}
        >
          Close
        </span>
        <h2 className="font-bold text-2xl mb-4 w-3/4">{roomName}</h2>
        <div className="flex justify-between">
          <div>
            <p>Attendees: {attendees}</p>
            <p>Questions Asked: {questionsAsked}</p>
          </div>
          {questions.length > 0 && (
            <div>
              <Button disabled={questions.length < 20}>Summarize</Button>
            </div>
          )}
        </div>
        {aiSummary.length > 0 && (
          <div className="bg-primary/50 p-5 rounded-xl my-4">
            <div className="flex justify-between items-center mb-4">
              <h2>AI Summary ✨</h2>
              <p className="bg-white px-4 text-sm py-1 rounded-full">
                summarized 10s ago
              </p>
            </div>
            <div className="max-h-24 overflow-scroll">
              <p>1. Here goes a summarized question</p>
              <p>1. Here goes a summarized question</p>
              <p>1. Here goes a summarized question</p>
            </div>
          </div>
        )}

        {questions.length > 0 && (
          <div className="p-2 flex flex-col gap-4 max-h-96 overflow-scroll">
            <h2 className="text-xl font-bold">Questions asked by attendees</h2>
            <div className="bg-primary/20 p-4 rounded-lg">
              <p className="mb-2">Here goes a question asked by a person</p>
              <div className="flex justify-start gap-2 items-end">
                <p>%NAME%</p>
                <p className="text-sm">~ %EMAIL%</p>
              </div>
            </div>
            <div className="bg-primary/20 p-4 rounded-lg">
              <p className="mb-2">Here goes a question asked by a person</p>
              <div className="flex justify-start gap-2 items-end">
                <p>%NAME%</p>
                <p className="text-sm">~ %EMAIL%</p>
              </div>
            </div>
            <div className="bg-primary/20 p-4 rounded-lg">
              <p className="mb-2">Here goes a question asked by a person</p>
              <div className="flex justify-start gap-2 items-end">
                <p>%NAME%</p>
                <p className="text-sm">~ %EMAIL%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoomCard({ hostName, hostId, room, room_number, showModal }) {
  const { revalidate } = useHostContext();
  const { title, active: isActive, code, id: roomId } = room;
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

  async function handleShareRoom() {
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

  async function handleActivateRoom(isActive, roomId) {
    const status = await activateRoomAction({ roomId, isActive });
    if (status) revalidate();
    else toast.error("Could not activate room");
  }

  async function handleViewQuestions() {
    showModal(true);
  }

  return (
    <>
      <a href="#" className="group relative block h-64 sm:h-80 lg:h-96">
        <span className="absolute inset-0 border-2 border-dashed border-black group-hover:border-primary"></span>

        <div className="relative flex h-full transform items-end border-2 border-black bg-white transition-transform group-hover:border-primary group-hover:-translate-x-2 group-hover:-translate-y-2">
          <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
            {isActive ? (
              <span className="absolute top-5 left-5 block w-fit mb-4 text-xs py-1 px-6 text-white bg-green-500 rounded-full">
                Active
              </span>
            ) : (
              <span className="absolute top-5 left-5 block w-fit mb-4 text-xs py-1 px-6 text-white bg-red-400 rounded-full">
                In Active
              </span>
            )}
            {/* <span className="absolute top-5 right-5 block w-fit mb-4 text-xs py-1 px-6 text-white bg-gray-400 rounded-full">
            Expires @6:30 pm
          </span> */}
            <h1 className="text-4xl font-bold">{room.title}</h1>
            <h2 className="mt-4 text-xl font-medium sm:text-2xl">
              Room #{room_number}
            </h2>
          </div>

          <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
            <h3 className="mt-4 text-xl font-medium sm:text-2xl">
              {room.title}
            </h3>

            <p className="my-4 text-sm sm:text-base">
              Here goes information about the room. Maybe the total attendees
              allowed, questions asked and stuff.
            </p>

            <div className="grid grid-cols-2 justify-stretch gap-4">
              <Button
                className={`${
                  isActive ? "bg-red-600 hover:bg-red-900 text-white" : ""
                }`}
                onClick={() => handleActivateRoom(isActive, roomId)}
              >
                {isActive ? "Deactivate" : "Activate"}
              </Button>

              <Button onClick={() => handleShareRoom()}>Share</Button>
              <Button onClick={() => handleViewQuestions()}>View</Button>
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
    </>
  );
}

function Rooms({ user }) {
  const { full_name: name, rooms, id } = user;
  const [showQuestions, setShowQuestions] = useState(true);
  const [modalData, setModalData] = useState({
    roomName: "%name%",
    attendees: 0,
    questionsAsked: 0,
    aiSummary: [],
    questions: [],
  });

  if (rooms.length === 0)
    return (
      <div className="py-52 text-2xl text-black/50 flex justify-center items-center">
        <p>No rooms found</p>
      </div>
    );
  return (
    <div className="relative w-full h-full z-0">
      {showQuestions && (
        <RoomSummaryModal
          data={modalData}
          closeModal={() => setShowQuestions(false)}
        />
      )}

      <div className="w-full p-10 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {rooms.map((room, index) => (
          <RoomCard
            hostName={name}
            hostId={id}
            key={index}
            room_number={index + 1}
            room={room}
            showModal={() => setShowQuestions(true)}
          />
        ))}
      </div>
    </div>
  );
}

export default Rooms;
