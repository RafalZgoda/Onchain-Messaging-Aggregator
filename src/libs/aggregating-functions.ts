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
  sendMessagePush,
  approveRequestPush,
} from "./push";
import * as PushAPI from "@pushprotocol/restapi";
import { Signer } from "ethers";
import _ from "lodash";
import {
  getAllConversationsFromNativeOnchain,
  getMessagesFromNativeOnchain,
  sendMessageNativeOnchain,
} from "./native-onchain-message";
export const getAggregatedConversations = async function ({
  xmtp_client,
  pgpPrivateKey,
  userAddress,
}: {
  xmtp_client: TXMTPClient;
  pgpPrivateKey: string;
  userAddress: string;
}): Promise<TConversation[]> {
  const xmtp_conversations = await getConversationsListXMTP({ xmtp_client });
  const push_conversations = await getAllConversationsPush({
    address: userAddress,
    pgpPrivateKey,
  });
  const push_requests = await getRequestsPush({
    address: userAddress,
    pgpPrivateKey,
  });
  const native_conversations = await getAllConversationsFromNativeOnchain(
    userAddress
  );

  const conversations = mergeConversations({
    conversationsXMTP: xmtp_conversations,
    conversationsPush: push_conversations,
    requestsPush: push_requests,
    nativeConversations: native_conversations,
  });

  return conversations;
};

const mergeConversations = function ({
  conversationsXMTP,
  conversationsPush,
  requestsPush,
  nativeConversations,
}: {
  conversationsXMTP: TConversation[];
  conversationsPush: TConversation[];
  requestsPush: TConversation[];
  nativeConversations: TConversation[];
}) {
  // Define an empty map to hold the merged conversations
  const mergedConversations = new Map();

  // Process XMTP conversations
  for (const conversation of conversationsXMTP) {
    mergedConversations.set(conversation.addressTo.toLowerCase(), {
      ...mergedConversations.get(conversation.addressTo.toLowerCase()),
      conversation_xmtp: conversation.conversation_xmtp,
      addressTo: conversation.addressTo,
    });
  }

  // Process Push conversations
  for (const conversation of conversationsPush) {
    mergedConversations.set(conversation.addressTo.toLowerCase(), {
      ...mergedConversations.get(conversation.addressTo.toLowerCase()),
      conversation_push: conversation.conversation_push,
      addressTo: conversation.addressTo,
    });
  }

  // Process Request conversations
  for (const conversation of requestsPush) {
    mergedConversations.set(conversation.addressTo.toLowerCase(), {
      ...mergedConversations.get(conversation.addressTo.toLowerCase()),
      conversation_push_request: conversation.conversation_push_request,
      addressTo: conversation.addressTo,
    });
  }

  // Process Native conversations
  for (const conversation of nativeConversations) {
    mergedConversations.set(conversation.addressTo.toLowerCase(), {
      ...mergedConversations.get(conversation.addressTo.toLowerCase()),
      conversation_native: conversation.conversation_native,
      addressTo: conversation.addressTo,
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
  otherAddress,
}: {
  conversation_xmtp?: TXMTPConversation;
  userAddress: string;
  conversation_push?: PushAPI.IFeeds;
  conversation_push_request?: PushAPI.IFeeds;
  pgpPrivateKey: string;
  otherAddress: string;
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
      address: otherAddress,
      threadhash: valid_conversation_push.threadhash,
      pgpPrivateKey,
      userAddress,
    });
    messages = [...messages, ...push_messages];
  }

  if (userAddress && otherAddress) {
    const onchainMessages = await getMessagesFromNativeOnchain(
      userAddress,
      otherAddress
    );

    messages = [...messages, ...onchainMessages];
  }

  messages = _.orderBy(messages, ["sentAt"], ["asc"]);

  return messages;
};

export const sendAggregatedMessage = async function ({
  conversation_xmtp,
  message,
  pgpPrivateKey,
  signer,
  otherAddress,
  conversation_push_request,
  userAddress,
  isNativeActive,
}: {
  conversation_xmtp?: TXMTPConversation;
  message: string;
  pgpPrivateKey: string;
  signer: Signer;
  otherAddress: string;
  conversation_push_request?: PushAPI.IFeeds;
  userAddress: string;
  isNativeActive: boolean;
}): Promise<void> {
  if (!message) return;
  if (conversation_xmtp) {
    await sendMessageXMTP({ conversation: conversation_xmtp, message });
  }
  if (signer && otherAddress && pgpPrivateKey) {
    if (conversation_push_request) {
      await approveRequestPush({
        pgpPrivateKey,
        signer,
        to: otherAddress,
        userAddress,
      });
    }
    await sendMessagePush({
      to: otherAddress,
      message,
      pgpPrivateKey,
      signer,
    });
  }
  if (isNativeActive && userAddress && otherAddress && signer) {
    await sendMessageNativeOnchain(signer.provider, otherAddress, message);
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
