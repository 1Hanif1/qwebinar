import { createRoom } from "./data-service";

export async function createRoomAction(FormData: FormData) {
  const roomName = FormData.get("room_name") as string;
  const numOfAttendees = FormData.get("num_of_attendees");
  const hostId = FormData.get("host_id");
  if (!roomName || !numOfAttendees || !hostId) return;
  createRoom({
    roomName,
    numOfAttendees: Number(numOfAttendees),
    hostId: Number(hostId),
  });
}
