import { TXMTPConversation } from "./xmtp";
import * as PushAPI from "@pushprotocol/restapi";
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
  addressTo: `0x${string}`;
  conversation_xmtp?: TXMTPConversation;
  conversation_push?: PushAPI.IFeeds;
  conversation_push_request?: PushAPI.IFeeds;
  conversation_native?: string;
  lastMessageDate?: Date;
};

export type TConversationByAddress = {
  address: string;
  conversations: TConversation[];
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
