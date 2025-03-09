"use server";

import { getServerSession } from "next-auth";
import { createRoom, deleteRoom, getRoom } from "./data-service";
import { authOptions } from "./auth";

export async function deleteRoomAction(
  state: boolean | null,
  FormData: FormData
) {
  console.log(FormData);
  const id = FormData.get("roomId");
  const { hostId } = await getServerSession(authOptions);
  console.log(hostId);
  // need to check if host is allowed to delete room with current id
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
  const duration = FormData.get("duration");
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

export async function SignOutAction() {}
