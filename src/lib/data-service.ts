import supabase from "@/config/supabase";

export async function createHost({
  fullName: full_name,
  email,
}: {
  fullName: string;
  email: string;
}) {
  try {
    const { data, error } = await supabase
      .from("Hosts")
      .insert([{ full_name, email }])
      .select();

    if (error) throw new Error(error.message);

    return data;
  } catch {
    throw new Error("Something went wrong, try again later");
  }
}

export async function getHost({ email }: { email: string }) {
  const { data, error } = await supabase
    .from("Hosts")
    .select()
    .eq("email", email)
    .single();

  if (error) return null;

  return data;
}

export async function createRoom({
  roomName: title,
  numOfAttendees: max_attendees,
  hostId,
  duration = 30,
}: {
  roomName: string;
  numOfAttendees: number;
  hostId: number;
  duration: number;
}) {
  const code = `CODE-${hostId}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("Rooms")
    .insert([{ title, max_attendees, hostId, code, duration }])
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function getRooms({ id }) {
  const { data, error } = await supabase
    .from("Rooms")
    .select()
    .eq("hostId", id);

  if (error) throw new Error(error.message);

  return data;
}

export async function getRoom({ id }) {
  const { data, error } = await supabase
    .from("Rooms")
    .select()
    .eq("id", id)
    .single();
  console.log("Error", error);
  if (!data) return null;
  return data;
}

export async function getRoomFromCode({ code }) {
  const { data: room_data, error: room_error } = await supabase
    .from("Rooms")
    .select()
    .eq("code", `CODE-${code}`)
    .single();
  if (room_error) console.log("Room Error", room_error);

  if (!room_data) return null;

  const { data: host_data, error: host_error } = await supabase
    .from("Hosts")
    .select()
    .eq("id", room_data.hostId)
    .single();

  console.log(host_data);

  const data = {
    ...room_data,
    host_name: host_data.full_name,
  };

  return data;
}

export async function deleteRoom({ id }) {
  const { error } = await supabase.from("Rooms").delete().eq("id", id);
  if (error) return false;
  else return true;
}

export async function activateRoom({ id, val = true }) {
  const { data, error } = await supabase
    .from("Rooms")
    .update({ active: val })
    .eq("id", id)
    .select();

  if (!data) return false;
  return true;
}

export async function addQuestion({ question, room_id }) {
  const { data, error } = await supabase
    .from("Questions")
    .insert([{ question, room_id }])
    .select();

  if (!data) console.log("Error ", error);

  return data;
}

export async function getMessages() {}
