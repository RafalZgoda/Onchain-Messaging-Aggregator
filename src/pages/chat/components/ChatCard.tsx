import { truncateHash } from "@/libs/utils";
import { TConversation } from "@/libs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { isVerified } from "@/libs/supabase";
export const ChatCard = ({ conversation }: { conversation: TConversation }) => {
  const {
    data: ensName,
    isError,
    isLoading: isEnsNameLoading,
  } = useEnsName({
    address: conversation.addressTo,
  });
  const [verified, setVerified] = useState(false);

  const checkVerified = async () => {
    const v = await isVerified(conversation.addressTo);
    setVerified(v);
  };

  const { data: ensAvartUrl } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  });

  useEffect(() => {
    checkVerified();
  }, []);

  return (
    <div className="grid grid-cols-5 p-2 cursor-pointer rounded-2xl hover:bg-[#222226] items-center">
      <div className="col-span-1">
        <Image
          src={ensAvartUrl ?? "/img/eth.png"}
          alt={conversation.addressTo}
          className="rounded-full w-15"
          width={50}
          height={50}
        />
      </div>
      <div className="col-span-4">
        <div className="flex justify-between">
          <h2 className="text-white text-sm flex items-center">
            {isEnsNameLoading
              ? conversation.addressTo
              : ensName ?? truncateHash(conversation.addressTo)}
            {verified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 ml-2 text-[#3C8AFF]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            )}
          </h2>
          <p className="text-xs text-telegram-gray-100">
            {new Date().toDateString() ===
            conversation?.lastMessageDate.toDateString()
              ? conversation?.lastMessageDate.toLocaleTimeString()
              : conversation?.lastMessageDate.toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-between text-right">
          <p className="text-xs text-telegram-gray-100"></p>
          <div className="bg-red-700 px-2 py-[1px] rounded-[100px] text-sm">
            8
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
