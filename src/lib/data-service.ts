import supabase from "@/config/supabase";
import getOpenAIClient from "@/config/openai";

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

export async function createAttendee({
  name,
  email,
  room_id,
}: {
  name: string;
  email: string;
  room_id: number;
}) {
  try {
    const { data, error } = await supabase
      .from("Attendees")
      .insert([{ name, email, room_id }])
      .select();

    if (error) throw new Error(error.message);

    return data;
  } catch {
    throw new Error("Something went wrong, try again later");
  }
}

export async function getAttendee({ email }: { email: string }) {
  const { data, error } = await supabase
    .from("Attendees")
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

export async function addQuestion({ question, room_id, attendee, email }) {
  const { data, error } = await supabase
    .from("Questions")
    .insert([{ question, room_id, attendee, email }])
    .select();

  if (!data) console.log("Error ", error);

  return data;
}

export async function getAllAttendees({ room_id }) {
  let { data: Attendees, error } = await supabase
    .from("Attendees")
    .select("*")
    .eq("room_id", room_id);

  if (!Attendees) console.log("Can not pull attendees");

  return Attendees;
}

export async function numOfAttendees({ room_id }) {
  const attendees = await getAllAttendees({ room_id });
  return attendees?.length || 0;
}

export async function summarize({ questions }) {
  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    instructions:
      "You are an assistant to a webinar host. Attendees will submit various questions, which may include duplicates, spam, or irrelevant text. Your task is to analyze all incoming questions and generate a concise, well-structured summary that captures the most relevant and commonly asked topics. Your summary should be a refined set of questions that, if answered by the host, would effectively address the concerns of all attendees. Remove redundant, off-topic, or low-quality inputs while preserving the key themes of discussion.",
    input: questions.join("\n"),
  });
  return response.output_text;
}
