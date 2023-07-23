import { TMessage } from "@/libs";
import Image from "next/image";
const Messages = ({ message }: { message: TMessage }) => {
  return (
    <div className="relative">
      <div
        className={`py-2 px-3 rounded-md text-white max-w-md break-words ${
          message.me ? "ml-auto" : "mr-auto"
        } right-0 m-2.5 text-s ${
          message.me ? "bg-[#35506f]" : "bg-[#3a4047]"
        } w-fit `}
      >
        {message.content}
      </div>

      <span
        className={`bottom-[-8px] absolute text-xs  ${
          message.me ? "right-2" : "left-3"
        }`}
      >
        <span className="mr-1">
        {new Date().toDateString() === message.sentAt.toDateString()
          ? message.sentAt.toLocaleTimeString()
          : message.sentAt.toLocaleDateString()}
        </span>
        

        <Image
          className="ml-2"
          src={message.platform.imgUrl}
          alt="avatar"
          width={12}
          height={12}
        />
      </span>
    </div>
  );
};

export default Messages;
