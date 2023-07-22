import { truncateHash } from "@/libs/utils";
import { TConversation } from "@/libs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { isVerified } from "@/libs/supabase";
import EnsNameAvatar from "./ENSNameAvatar";
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
		<div className="flex justify-between p-2 cursor-pointer rounded-2xl hover:bg-[#222226] items-center pb-4">
			<EnsNameAvatar
				address={conversation.addressTo}
				subtext="last"
				avatarSize={55}
			/>
			<div className="flex justify-between text-right">
				<p className="text-xs text-telegram-gray-100"></p>
				<div className="bg-blue-600 px-2 py-[1px] rounded-[100px] text-sm">
					8
				</div>
			</div>
		</div>
	);
};

export default ChatCard;
