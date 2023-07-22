import { TMessage } from "@/libs";
import Image from "next/image";
const Messages = ({ message }: { message: TMessage }) => {
	return (
		<div className="relative">
			<div
				className={`py-2 px-3 rounded-md text-white ${
					message.me ? "ml-auto" : "mr-auto"
				} right-0 m-2.5 text-s bg-telegram-${
					message.me ? "gray-300" : "gray-200"
				} w-fit`}
			>
				{message.content}
			</div>

			<span
				className={`bottom-[-8px] absolute text-xs ${
					message.me ? "right-2" : "left-3"
				}`}
			>
				{new Date().toDateString() === message.sent.toDateString()
					? message.sent.toLocaleTimeString()
					: message.sent.toLocaleDateString()}
			</span>
		</div>
	);
};

export default Messages;
