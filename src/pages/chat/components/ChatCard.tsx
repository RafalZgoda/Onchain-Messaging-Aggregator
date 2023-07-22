import { truncateHash } from "@/libs/utils";
import { TConversation } from "libs";
import Image from "next/image";
import { useEnsAvatar, useEnsName } from "wagmi";
export const ChatCard = ({ conversation }: { conversation: TConversation }) => {
	const {
		data: ensName,
		isError,
		isLoading: isEnsNameLoading,
	} = useEnsName({
		address: conversation.addressTo,
	});

	const { data: ensAvartUrl } = useEnsAvatar({
		name: ensName,
		chainId: 1,
	});

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
					<h2 className="text-white text-sm">
						{isEnsNameLoading
							? conversation.addressTo
							: ensName ?? truncateHash(conversation.addressTo)}
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
