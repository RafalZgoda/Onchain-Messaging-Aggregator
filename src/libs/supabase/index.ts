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

export const verifyUser = async (address) => {
  const { data, error } = await supabase.from("users").insert({
    address: address.toLowerCase(),
    isVerifiedWorldcoin: true,
  });
  if (error) throw error;
  return data;
};

export const isVerified = async (address) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("address", address.toLowerCase());
  if (error) throw error;
  return data.length > 0;
};

export const updateWorldcoinFilter = async (address, worldcoinFilter) => {
  const { data, error } = await supabase
    .from("users")
    .update({ worldcoinFilter })
    .eq("address", address.toLowerCase());
  if (error) throw error;
};

export const isWorldcoinFilter = async (address): Promise<boolean> => {
  const { data, error } = await supabase
    .from("users")
    .select("worldcoinFilter")
    .eq("address", address.toLowerCase());
  if (error) throw error;
  if (data[0]?.worldcoinFilter) {
    return data[0]?.worldcoinFilter;
  }
  return false;
};
