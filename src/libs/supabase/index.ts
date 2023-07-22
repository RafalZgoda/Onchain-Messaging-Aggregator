import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string
);

export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

export const getConversations = async (owner) => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("owner", owner);
  if (error) throw error;
  return data;
};

export const setLastSeen = async (lastSeenHash, owner, recipient) => {
  const { data, error } = await supabase
    .from("conversations")
    .update({ lastSeenHash })
    .eq("owner", owner)
    .eq("recipient", recipient);
  if (error) throw error;
  return data;
};

export const updateBadges = async (owner, badges) => {
  // isVerifiedWorldcoin
  const { data, error } = await supabase
    .from("conversations")
    .update({ ...badges })
    .eq("owner", owner);
  if (error) throw error;
  return data;
};
