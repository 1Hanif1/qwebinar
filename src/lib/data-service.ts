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

  if (error) throw new Error(error.message);

  return data;
}

export async function createRoom({
  roomName: title,
  numOfAttendees: max_attendees,
  hostId,
}: {
  roomName: string;
  numOfAttendees: number;
  hostId: number;
}) {
  const code = `CODE-${hostId}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("Rooms")
    .insert([{ title, max_attendees, hostId, code }])
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function createMessage() {}

export async function getRooms() {}

export async function getMessages() {}

export async function getRoom() {}
