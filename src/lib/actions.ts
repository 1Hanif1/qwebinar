"use server";

import { createRoom } from "./data-service";

export async function createRoomAction(
  state: boolean | null,
  FormData: FormData
): Promise<boolean> {
  const roomName = FormData.get("room_name") as string;
  const numOfAttendees = FormData.get("num_of_attendees");
  const hostId = FormData.get("host_id");
  if (!roomName || !numOfAttendees || !hostId) return false;
  try {
    await createRoom({
      roomName,
      numOfAttendees: Number(numOfAttendees),
      hostId: Number(hostId),
    });
    return true;
  } catch {
    return false;
  }
}

export async function SignOutAction() {}
