import { TXMTPConversation } from "./xmtp";

export type TMessage = {
  id: string;
  senderAddress: string;
  recipientAddress: string;
  sent: Date;
  content: string;
  platform: string;
  me: boolean;
};

export type TConversation = {
  id: string;
  addressTo: string;
  platform: string;
  imgUrl: string;
  lastMessageDate: Date;
  conversation_xmtp?: TXMTPConversation;
};

export type TMessagePlatform = {
  id: string;
  name: string;
  urlLogo: string;
};

const platforms = {
  xmtp: {
    id: "xmtp",
    name: "XMTP",
    urlLogo: "https://i.pravatar.cc/45?img=11",
  },
  push: {
    id: "push",
    name: "Push",
    urlLogo: "https://i.pravatar.cc/45?img=12",
  },
  tx: {
    id: "tx",
    name: "TX",
    urlLogo: "https://i.pravatar.cc/45?img=13",
  },
};
