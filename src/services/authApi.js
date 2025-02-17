import supabase from "../config/supabase";
export async function signup({ email, password }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}
