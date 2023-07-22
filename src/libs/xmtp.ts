import {
  Client as TXMTPClient,
  DecodedMessage as TXMTPMessage,
  Conversation as TXMTPConversation,
} from "@xmtp/xmtp-js";
import { JsonRpcSigner } from "@ethersproject/providers";
import { TMessage, MESSAGE_PLATFORMS, TConversation } from "./types";
export type { TXMTPClient, TXMTPMessage, TXMTPConversation };

export const initXMTPClient = async function ({
  signer,
}: {
  signer: JsonRpcSigner;
}): Promise<TXMTPClient> {
  const xmtp = await TXMTPClient.create(signer, { env: "production" });
  return xmtp;
};

export const getConversationXMTP = async function ({
  xmtp_client,
  addressTo,
}: {
  xmtp_client: TXMTPClient;
  addressTo: string;
}): Promise<TXMTPConversation | null> {
  //Creates a new conversation with the address
  console.log(xmtp_client);
  if (await xmtp_client?.canMessage(addressTo)) {
    console.log("can message");
    const conversation = await xmtp_client.conversations.newConversation(
      addressTo
    );
    return conversation;
  } else {
    console.log("cant message because is not on the network.");
    return null; // or throw error
  }
};

export const getMessagesHistoryXMTP = async function ({
  conversation,
  userAddress,
}: {
  conversation: TXMTPConversation;
  userAddress: string;
}): Promise<TMessage[]> {
  //Creates a new conversation with the address
  if (!conversation) return [];
  const messages = await conversation.messages();
  return formatMessagesXMTP({ messages, userAddress });
};

export const sendMessageXMTP = async function ({
  conversation,
  message,
}: {
  conversation: TXMTPConversation;
  message: string;
}): Promise<void> {
  console.log(conversation);
  await conversation.send(message);
};

export const getConversationsListXMTP = async function ({
  xmtp_client,
}: {
  xmtp_client: TXMTPClient;
}): Promise<TConversation[]> {
  if (!xmtp_client) return [];
  const conversations = await xmtp_client.conversations.list();
  const formattedConversations = formatConversationsXMTP(conversations);
  return formattedConversations;
};

export const formatMessagesXMTP = async function ({
  messages,
  userAddress,
}: {
  messages: TXMTPMessage[];
  userAddress: string;
}): Promise<TMessage[]> {
  const userAddressLower = userAddress.toLowerCase();
  const formattedMessages: TMessage[] = [];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const formattedMessage: TMessage = {
      id: message.id,
      senderAddress: message.senderAddress,
      recipientAddress: message.recipientAddress || "",
      sentAt: message.sent,
      content: message.content.toString(),
      platform: MESSAGE_PLATFORMS.xmtp,
      me: message.senderAddress.toLowerCase() === userAddressLower,
    };
    formattedMessages.push(formattedMessage);
  }
  return formattedMessages;
};

export const streamMessagesXMTP = async ({
  conversation,
  olderMessages,
}: {
  conversation: TXMTPConversation;
  olderMessages: TMessage[]; //| TXMTPMessage[];
}) => {
  const newStream = await conversation.streamMessages();
  for await (const newMsg of newStream) {
    const isNew = olderMessages.find((m) => m.id === newMsg.id);
    if (isNew) {
      // setMessages((prevMessages) => {
      //   const msgsnew = [...prevMessages, newMsg];
      //   return msgsnew;
      // });
      // updateMessages(oldMessages, newMsg);
    }
  }
};

const formatConversationsXMTP = function (
  conversationsXMTP: TXMTPConversation[]
): TConversation[] {
  const conversations = conversationsXMTP.map((conversation) => {
    return {
      id: "randomId",
      addressTo: conversation.peerAddress as `0x${string}`,
      platform: MESSAGE_PLATFORMS.xmtp,
      imgUrl: "https://i.pravatar.cc/45?img=11",
      lastMessageDate: new Date(),
      conversation_xmtp: conversation,
    };
  });
  return conversations;
};
