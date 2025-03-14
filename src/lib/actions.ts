"use server";

import { getServerSession } from "next-auth";
import {
  activateRoom,
  addQuestion,
  createAttendee,
  createRoom,
  deleteRoom,
  getAllAttendees,
  getAttendee,
  getRoom,
  getRoomFromCode,
} from "./data-service";
import { authOptions } from "./auth";

export async function activateRoomAction({ roomId: id, isActive }) {
  const { hostId } = await getServerSession(authOptions);
  // need to check if host is allowed to delete room with current id
  console.log("ACTION", id);
  const room = await getRoom({ id });
  if (room.hostId !== hostId) throw new Error("Unauthorized");
  const status = await activateRoom({ id, val: !isActive });
  return status;
}

export async function deleteRoomAction(
  state: boolean | null,
  FormData: FormData
) {
  const id = FormData.get("roomId");
  const { hostId } = await getServerSession(authOptions);
  const room = await getRoom({ id });
  if (room.hostId !== hostId) throw new Error("Unauthorized");
  const status = await deleteRoom({ id });
  return status;
}

export async function createRoomAction(
  state: boolean | null,
  FormData: FormData
): Promise<boolean> {
  const { premium } = getServerSession(authOptions);
  const roomName = FormData.get("room_name") as string;
  const numOfAttendees = FormData.get("num_of_attendees");
  const hostId = FormData.get("host_id");
  const duration = FormData.get("duration") || 30;
  if (!premium && +duration > 30) return false;
  if (!roomName || !numOfAttendees || !hostId) return false;
  try {
    await createRoom({
      roomName,
      numOfAttendees: Number(numOfAttendees),
      hostId: Number(hostId),
      duration,
    });
    return true;
  } catch {
    return false;
  }
}

// {status, data, error}
export async function joinRoomAction({ code, name, email }) {
  const room = await getRoomFromCode({ code });
  if (!room) return { status: false, data: null, error: "No room found" };

  // Check if user exists in db else create new user
  let user = await getAttendee({ email });
  if (!user) {
    const numAttendees = await getAllAttendees({ room_id: room.id });
    if (!numAttendees || numAttendees >= room.max_attendees)
      return {
        status: false,
        message: "Room is full",
      };
    user = await createAttendee({ name, email, room_id: room.id });
  }

  return {
    status: true,
    name: user.name,
    email: user.email,
  };
}

export async function askQuestionAction({ question, code, attendee, email }) {
  // get room
  const room = await getRoomFromCode({ code });
  if (!room) return { status: false, data: null, error: "No room found" };

  // Check if it is active
  if (!room.active)
    return {
      status: false,
      data: null,
      error: "Room is inactive. Contact Host!",
    };

  // add question to room with id
  const result = await addQuestion({
    question,
    room_id: room.id,
    attendee,
    email,
  });
  if (!result)
    return { status: false, data: null, error: "Something went wrong" };
  // return true
  return { status: true };
}

export async function SignOutAction() {}
