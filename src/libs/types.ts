import { TXMTPConversation } from "./xmtp";

export type TMessage = {
  id: string;
  senderAddress: string;
  recipientAddress: string;
  sentAt: Date;
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
  owner?: string;
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
    imgUrl: "/img/xmtp.png",
  } as TMessagePlatform,
  push: {
    id: "push",
    name: "Push",
    imgUrl: "/img/push.png",
  } as TMessagePlatform,
  native: {
    id: "native",
    name: "Native",
    imgUrl: "/img/eth.png",
  } as TMessagePlatform,
};

export const MESSAGE_PLATFORMS_ARRAY = Object.values(MESSAGE_PLATFORMS);

export const MESSAGE_PLATFORMS_NAMES = Object.values(MESSAGE_PLATFORMS).map(
  (platform) => platform.name
);
