import { TConversation, TMessage } from "./types";
import {
  getConversationsListXMTP,
  getMessagesHistoryXMTP,
  TXMTPClient,
  TXMTPConversation,
  sendMessageXMTP,
  getConversationXMTP,
} from "./xmtp";
import {
  getAllConversationsPush,
  getRequestsPush,
  getMessagesPush,
} from "./push";
import * as PushAPI from "@pushprotocol/restapi";

import { getAllConversationsFromNativeOnchain } from "./native-onchain-message";
export const getAggregatedConversations = async function ({
  xmtp_client,
  pgpPrivateKey,
  userAddress,
}: {
  xmtp_client: TXMTPClient;
  pgpPrivateKey: string;
  userAddress: string;
}): Promise<TConversation[]> {
  console.log({ msg: "fetching conversations", userAddress });
  const xmtp_conversations = await getConversationsListXMTP({ xmtp_client });
  const push_conversations = await getAllConversationsPush({
    address: userAddress,
    pgpPrivateKey,
  });
  const push_requests = await getRequestsPush({
    address: userAddress,
    pgpPrivateKey,
  });
  const conversations = mergeConversations({
    conversationsXMTP: xmtp_conversations,
    conversationsPush: push_conversations,
    requestsPush: push_requests,
  });

  const native_conversations = await getAllConversationsFromNativeOnchain(
    userAddress
  );

  const allConversations = [...conversations, ...native_conversations];
  console.log({ allConversations });
  return allConversations;
};

const mergeConversations = function ({
  conversationsXMTP,
  conversationsPush,
  requestsPush,
}) {
  // Define an empty map to hold the merged conversations
  const mergedConversations = new Map();

  // Process XMTP conversations
  for (const conversation of conversationsXMTP) {
    mergedConversations.set(conversation.addressTo, {
      ...mergedConversations.get(conversation.addressTo),
      conversation_xmtp: conversation.conversation_xmtp,
    });
  }

  // Process Push conversations
  for (const conversation of conversationsPush) {
    mergedConversations.set(conversation.addressTo, {
      ...mergedConversations.get(conversation.addressTo),
      conversation_push: conversation.conversation_push,
    });
  }

  // Process Request conversations
  for (const conversation of requestsPush) {
    mergedConversations.set(conversation.addressTo, {
      ...mergedConversations.get(conversation.addressTo),
      conversation_push_request: conversation.conversation_push_request,
    });
  }

  // Convert the map values to an array and return it
  return Array.from(mergedConversations.values());
};

export const getAggregatedMessages = async function ({
  conversation_xmtp,
  userAddress,
  conversation_push,
  conversation_push_request,
  pgpPrivateKey,
}: {
  conversation_xmtp?: TXMTPConversation;
  userAddress: string;
  conversation_push?: PushAPI.IFeeds;
  conversation_push_request?: PushAPI.IFeeds;
  pgpPrivateKey: string;
}): Promise<TMessage[]> {
  let messages = [] as TMessage[];

  if (conversation_xmtp) {
    const xmtp_messages = await getMessagesHistoryXMTP({
      conversation: conversation_xmtp,
      userAddress,
    });
    messages = [...messages, ...xmtp_messages];
  }

  if (conversation_push || conversation_push_request) {
    const valid_conversation_push = conversation_push
      ? conversation_push
      : conversation_push_request;
    const push_messages = await getMessagesPush({
      address: valid_conversation_push.wallets.split(":")[1],
      threadhash: valid_conversation_push.threadhash,
      pgpPrivateKey,
      userAddress,
    });
    messages = [...messages, ...push_messages];
  }

  return messages;
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
  const conversation = await getConversationXMTP({
    xmtp_client,
    addressTo,
  });
  await sendMessageXMTP({ conversation, message });
};
