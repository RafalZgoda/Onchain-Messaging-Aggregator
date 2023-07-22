import { TConversation, TMessage, MESSAGE_PLATFORMS } from "./types";
import {
  getConversationsListXMTP,
  getMessagesHistoryXMTP,
  TXMTPClient,
  TXMTPConversation,
  sendMessageXMTP,
  getConversationXMTP,
} from "./xmtp";
export const getAggregatedConversations = async function ({
  xmtp_client,
}: {
  xmtp_client: TXMTPClient;
}): Promise<TConversation[]> {
  const xmtp_conversations = await getConversationsListXMTP({ xmtp_client });
  const conversations = formatConversations({
    conversationsXMTP: xmtp_conversations,
  });
  return conversations;
};

const formatConversations = function ({
  conversationsXMTP,
}: {
  conversationsXMTP: TXMTPConversation[];
}): TConversation[] {
  const conversations = conversationsXMTP.map((conversation) => {
    return {
      id: "randomId",
      addressTo: conversation.peerAddress,
      platform: MESSAGE_PLATFORMS.xmtp,
      imgUrl: "https://i.pravatar.cc/45?img=11",
      lastMessageDate: new Date(),
      conversation_xmtp: conversation,
    };
  });
  return conversations;
};

export const getAggregatedMessages = async function ({
  conversation_xmtp,
  userAddress,
}: {
  conversation_xmtp?: TXMTPConversation;
  userAddress: string;
}): Promise<TMessage[]> {
  if (!conversation_xmtp) {
    //and others
    return [];
  }
  const xmtp_messages = await getMessagesHistoryXMTP({
    conversation: conversation_xmtp,
    userAddress,
  });
  return xmtp_messages;
};

export const sendAggregatedMessage = async function ({
  conversation_xmtp,
  message,
}: {
  conversation_xmtp?: TXMTPConversation;
  message: string;
}): Promise<void> {
  if (conversation_xmtp) {
    await sendMessageXMTP({ conversation: conversation_xmtp, message });
  }
};

export const sendAggregatedNewMessage = async function ({
  xmtp_client,
  addressTo,
  message,
}: {
  xmtp_client?: TXMTPClient;
  addressTo: string;
  message: string;
}): Promise<void> {
  console.log(xmtp_client);
  const conversation = await getConversationXMTP({
    xmtp_client,
    addressTo,
  });
  console.log(conversation);
  await sendMessageXMTP({ conversation, message });
};
