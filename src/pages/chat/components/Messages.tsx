import { TMessage } from "libs";
import Image from "next/image";
const Messages = ({ message }: { message: TMessage }) => {
  return (
    <div
      className={`text-white text-${
        message.me ? "right" : "left"
      } m-2.5  text-s`}
    >
      <div
        className={`bg-telegram-${
          message.me ? "gray-300" : "gray-200"
        } relative inline p-1.5 pl-2.5 pr-12 rounded-md text-white`}
      >
        {message.content}
        <span className="text-xs right-1 bottom-0 absolute opacity-60">
          {message.sent.toDateString()} ✓
        </span>
        <span className="text-xs right-1 bottom-0 absolute opacity-60">
          {message.platform.name}
          <Image
            src={message.platform.imgUrl}
            alt={message.platform.name}
            className="rounded-full w-15"
            width={20}
            height={20}
          />
        </span>
      </div>
    </div>
  );
};

export default Messages;
