import { TXMTPConversation } from "./xmtp";

export type TMessage = {
  id: string;
  senderAddress: string;
  recipientAddress: string;
  sent: Date;
  content: string;
  platform: TMessagePlatform;
  me: boolean;
};

export type TConversation = {
  id: string;
  addressTo: string;
  platform: TMessagePlatform;
  imgUrl: string;
  lastMessageDate: Date;
  conversation_xmtp?: TXMTPConversation;
};

export type TMessagePlatform = {
  id: string;
  name: string;
  imgUrl: string;
};

export const MESSAGE_PLATFORMS = {
  xmtp: {
    id: "xmtp",
    name: "XMTP",
    imgUrl: "xmtp.png",
  } as TMessagePlatform,
  push: {
    id: "push",
    name: "Push",
    imgUrl: "push.png",
  } as TMessagePlatform,
  vanilla: {
    id: "vanilla",
    name: "Vanilla",
    imgUrl: "eth.png",
  } as TMessagePlatform,
};

export const MESSAGE_PLATFORMS_ARRAY = Object.values(MESSAGE_PLATFORMS);

export const MESSAGE_PLATFORMS_NAMES = Object.values(MESSAGE_PLATFORMS).map(
  (platform) => platform.name
);
