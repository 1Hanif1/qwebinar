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
  try {
    const { data, error } = await supabase
      .from("Hosts")
      .select()
      .eq("email", email)
      .single();

    if (error) throw new Error(error.message);

    return data;
  } catch {
    throw new Error("Something went wrong, try again later");
  }
}

export async function createRoom({
  roomName,
  numOfAttendees,
  hostId,
}: {
  roomName: string;
  numOfAttendees: number;
  hostId: number;
}) {}

export async function createMessage() {}

export async function getRooms() {}

export async function getMessages() {}

export async function getRoom() {}
