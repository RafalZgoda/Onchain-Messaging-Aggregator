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
    imgUrl: "https://i.pravatar.cc/45?img=11",
  } as TMessagePlatform,
  push: {
    id: "push",
    name: "Push",
    imgUrl: "https://i.pravatar.cc/45?img=12",
  } as TMessagePlatform,
  tx: {
    id: "tx",
    name: "TX",
    imgUrl: "https://i.pravatar.cc/45?img=13",
  } as TMessagePlatform,
}
