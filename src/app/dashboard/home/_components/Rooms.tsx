import { Button } from "@/components/ui/button";
import { useHostContext } from "@/contexts/HostContext";
import {
  activateRoomAction,
  deleteRoomAction,
  summarizeAction,
} from "@/lib/actions";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import supabase from "@/config/supabase";
import Spinner from "@/components/ui/Spinner";

const APP_URL = "http://localhost:3000";

const formatTime = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

interface Question {
  id: number;
  room_id: number;
  question: string;
  attendee: string;
  email: string;
  submitted_at: string;
}

interface RoomData {
  attendees: number;
  numQuestions: number;
  aiSummary: string[]; // Adjust the type as needed
  questions: Question[];
}

function RoomSummaryModal({
  data,
  closeModal,
}: {
  data: any;
  closeModal: any;
}) {
  const { roomName, roomId } = data;
  const [roomData, setRoomData] = useState<RoomData>({
    attendees: 0,
    numQuestions: 0,
    aiSummary: [],
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  /**
   * {
    roomName: "%name%",
    attendees: 0,
    roomId: -1,
    questionsAsked: 0,
    aiSummary: [],
    questions: [],
  }
   */

  useEffect(() => {
    if (roomId === -1) return;
    async function fetchData() {
      setLoading(true);
      const { data: questionData, error: questionError } = await supabase
        .from("Questions")
        .select("*")
        .eq("room_id", roomId);

      const { data: attendeeData, error: attendeeError } = await supabase
        .from("Attendees")
        .select("*")
        .eq("room_id", roomId);

      if (questionError) toast.error(`Error fetching questions`);
      if (attendeeError) toast.error(`Error fetching attendees`);

      setRoomData({
        attendees: attendeeData?.length || 0,
        numQuestions: questionData?.length || 0,
        aiSummary: [],
        questions: questionData || [],
      });
      setLoading(false);
    }

    fetchData();
    // Subscribe to Questions Table
    const questionsSubscription = supabase
      .channel("questions")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Questions",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log("NEW QUESTION INCOMING");
          console.log(payload.new);
          /**
           * {
                "attendee": "Hanif",
                "email": "hanif@exmaple.com",
                "id": 9,
                "question": "wuobgonvweocvn2",
                "room_id": 18,
                "submitted_at": "2025-03-13T17:40:06.618609+00:00"
            }
           */
          setRoomData((prev) => ({
            ...prev,
            numQuestions: prev.numQuestions + 1,
            questions: prev.questions.concat({
              id: payload.new.id,
              room_id: payload.new.room_id,
              attendee: payload.new.attendee,
              email: payload.new.email,
              question: payload.new.question,
              submitted_at: payload.new.submitted_at,
            }),
          }));
        }
      )
      .subscribe();

    // Subscribe to Attendees Table
    const attendeesSubscription = supabase
      .channel("attendees")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "attendees",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log(payload);
          // setRoomData((prev) => ({
          //   ...prev,
          //   attendees: payload.new.attendee_count || prev.attendees,
          // }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questionsSubscription);
      supabase.removeChannel(attendeesSubscription);
    };
  }, [roomId]);

  async function summaryHandler() {
    setLoading(true);
    const summary = await summarizeAction({ questions: roomData.questions });
    setRoomData((prev) => ({
      ...prev,
      aiSummary: summary?.split("*") || [],
    }));
    setLoading(false);
  }

  return (
    <div className="bg-slate-500/20 backdrop-blur-3xl py-10 px-5 md:p-10 absolute w-full h-full z-10 flex justify-center">
      <div className="relative bg-white max-h-max p-10 md:w-1/2 rounded-2xl z-20">
        <span
          className="absolute right-10 cursor-pointer underline"
          onClick={closeModal}
        >
          Close
        </span>
        <h2 className="font-bold text-2xl mb-4 w-3/4">{roomName}</h2>
        <div className="flex justify-between">
          <div>
            <p>Attendees: {roomData.attendees}</p>
            <p>Questions Asked: {roomData.numQuestions}</p>
          </div>
          {roomData.questions.length > 0 && (
            <div>
              <Button
                onClick={summaryHandler}
                disabled={roomData.questions.length < 20}
              >
                Summarize
              </Button>
            </div>
          )}
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {roomData.aiSummary.length > 0 && (
              <div className="bg-primary/50 p-5 rounded-xl my-4">
                <div className="flex justify-between items-center mb-4">
                  <h2>AI Summary ✨</h2>
                </div>
                <div className="max-h-24 overflow-scroll">
                  {roomData.aiSummary.map((sum) => (
                    <p key={sum}>{sum}</p>
                  ))}
                </div>
              </div>
            )}
            {roomData.questions.length > 0 && (
              <div className="mt-4 flex flex-col gap-4 max-h-96 overflow-scroll">
                <h2 className="text-xl font-bold">
                  Questions asked by attendees
                </h2>
                {roomData.questions
                  .slice()
                  .reverse()
                  .map((question, index) => (
                    <div
                      key={index}
                      className="bg-primary/20 p-4 rounded-lg relative"
                    >
                      <p className="text-xs italic text-right absolute right-3 top-3">
                        {formatTime(question.submitted_at)}
                      </p>
                      <p>{question.question || null}</p>
                      {question.attendee && question.email && (
                        <div className=" mt-2 flex justify-start gap-2 items-end">
                          <p>{question.attendee}</p>
                          <p className="text-sm">{question.email}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </>
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

          <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8 w-full bg">
            <h3 className="mb-10 text-4xl font-bold sm:text-3xl">
              {room.title}
            </h3>

            {/* <p className="my-4 text-sm sm:text-base">
              Here goes information about the room. Maybe the total attendees
              allowed, questions asked and stuff.
            </p> */}

            <div className="grid grid-cols-2 justify-stretch gap-4 ">
              <Button
                className={`${
                  isActive ? "bg-red-600 hover:bg-red-900 text-white" : ""
                }`}
                onClick={() => handleActivateRoom(isActive, roomId)}
              >
                {isActive ? "Deactivate" : "Activate"}
              </Button>

              <Button onClick={() => handleShareRoom()}>Share</Button>
              <Button
                onClick={() => handleViewQuestions()}
                disabled={!isActive}
              >
                View
              </Button>
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
  const [showQuestions, setShowQuestions] = useState(false);
  const [modalData, setModalData] = useState({
    roomName: "%name%",
    roomId: -1,
  });

  useEffect(
    function () {
      if (!showQuestions)
        setModalData({
          roomName: "%name%",
          roomId: -1,
        });
      else {
      }
    },
    [showQuestions]
  );

  function handleShowModal(room) {
    const { title, active: isActive, code, id: roomId } = room;
    setModalData({
      roomName: title,
      roomId,
      attendees: 0,
      questionsAsked: 0,
      aiSummary: [],
      questions: [],
    });
    setShowQuestions(true);
  }

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
            showModal={() => handleShowModal(room)}
          />
        ))}
      </div>
    </div>
  );
}

export default Rooms;
