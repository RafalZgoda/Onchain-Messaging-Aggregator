import { isWorldcoinFilter, updateWorldcoinFilter } from "@/libs/supabase";
import { Loader, Switch } from "@mantine/core";
import { useEffect, useState } from "react";

export const Preferences = ({ signer }) => {
  const [worldcoinChecked, setWorldcoinChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateWorldcoin = async () => {
    const check = !worldcoinChecked;
    setWorldcoinChecked(check);
    await updateWorldcoinFilter(signer._address, check);
  };

  const getWorldcoin = async () => {
    setLoading(true);
    const is = await isWorldcoinFilter(signer._address);
    setWorldcoinChecked(is);
    setLoading(false);
  };

  useEffect(() => {
    getWorldcoin();
  }, []);

  return (
    <div className="px-20">
      {loading && <Loader className="block mt-20 mx-auto" />}
      {!loading && (
        <div>
          <h1>Quality filters</h1>
          <p>Choose the notifications you want to see, and those you want to avoid.</p>
          <div className="flex items-center">
            <Switch
              size="xl"
              onLabel="ON"
              offLabel="OFF"
              checked={worldcoinChecked}
              onChange={updateWorldcoin}
            />
            <p className="ml-3 text-xl">Only show verified users</p>
          </div>
        </div>
      )}
    </div>
  );
};
