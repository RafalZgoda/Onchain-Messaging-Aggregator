import * as PushAPI from "@pushprotocol/restapi";
import { Signer, ethers } from "ethers";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { TMessage, MESSAGE_PLATFORMS, TConversation } from "../libs/index";

export const createUserPush = async ({
  address,
  signer,
}: {
  address: string;
  signer: Signer;
}): Promise<PushAPI.IUser> => {
  return await PushAPI.user.create({
    env: ENV.PROD,
    account: `eip155:${address}`,
    signer,
    progressHook: (progress) => console.log("Progress: ", progress),
  });
};

export const getUserPush = async (address: string): Promise<PushAPI.IUser> => {
  return await PushAPI.user.get({
    account: `eip155:${address}`,
    env: ENV.PROD,
  });
};

export const decryptPGPKeyPush = async ({
  encryptedPGPPrivateKey,
  signer,
}: {
  encryptedPGPPrivateKey: string;
  signer: Signer;
}): Promise<string> => {
  return await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey,
    signer,
  });
};

export const getAllConversationsPush = async ({
  address,
  pgpPrivateKey,
}: {
  address: string;
  pgpPrivateKey: string;
}): Promise<TConversation[]> => {
  if (!pgpPrivateKey) {
    return [];
  }
  const push_conversations = await PushAPI.chat.chats({
    account: `eip155:${address}`,
    toDecrypt: true,
    pgpPrivateKey,
    env: ENV.PROD,
  });
  const formattedConversations = formatConversationsPush({
    conversations: push_conversations,
    isRequest: false,
  });
  return formattedConversations;
};

const formatConversationsPush = ({
  conversations,
  isRequest,
}: {
  conversations: PushAPI.IFeeds[];
  isRequest: boolean;
}): TConversation[] => {
  return conversations.map((conversation) => {
    return {
      id: conversation?.chatId,
      // conversartio.publicKey is like : "eip155:0x0f060c6cf1E11C5f5dED60932f9CadCAcA24E49C"
      addressTo: conversation?.wallets?.split(":")[1] as `0x${string}`,
      content: "",
      lastMessageDate: new Date(),
      platform: MESSAGE_PLATFORMS.push,
      imgUrl: "",
      conversation_push: isRequest ? undefined : conversation,
      conversation_push_request: isRequest ? conversation : undefined,
    };
  });
};

export const getMessagesPush = async ({
  threadhash,
  address,
  pgpPrivateKey,
  userAddress,
}: {
  threadhash: string;
  address: string;
  pgpPrivateKey: string;
  userAddress: string;
}): Promise<TMessage[]> => {
  const userAddressLower = userAddress.toLowerCase();
  console.log("1");
  console.log({
    threadhash,
    pgpPrivateKey,
    account: `eip155:${address}`,
    toDecrypt: true,
    env: ENV.PROD,
  });
  const response = await PushAPI.chat.history({
    threadhash,
    pgpPrivateKey,
    account: `eip155:${userAddressLower}`,
    toDecrypt: true,
    env: ENV.PROD,
  });
  console.log("2");
  return response.map((message) => {
    const value = JSON.stringify(message);
    const bytesValue = ethers.utils.toUtf8Bytes(value);
    const hashedValue = ethers.utils.sha256(bytesValue);
    return {
      id: hashedValue,
      senderAddress: message.fromDID.split(":")[1],
      recipientAddress: message.toDID.split(":")[1],
      content:
        typeof message.messageObj === "string"
          ? JSON.stringify(message.messageObj)
          : JSON.stringify(message.messageObj?.content),
      sentAt: new Date(message.timestamp as number),
      platform: MESSAGE_PLATFORMS.push,
      me: message.fromDID.split(":")[1].toLowerCase() === userAddressLower,
    };
  });
};

export const sendMessagePush = async ({
  to,
  message,
  signer,
  pgpPrivateKey,
}: {
  to: string;
  message: string;
  signer: Signer;
  pgpPrivateKey: string;
}) => {
  console.log("sending to", to);
  return await PushAPI.chat.send({
    messageContent: message,
    messageType: "Text", // can be "Text" | "Image" | "File" | "GIF"
    receiverAddress: `eip155:${to}`,
    signer,
    pgpPrivateKey,
    env: ENV.PROD,
  });
};

export const getRequestsPush = async ({
  address,
  pgpPrivateKey,
}: {
  address: string;
  pgpPrivateKey: string;
}): Promise<TConversation[]> => {
  if (!pgpPrivateKey) {
    return [];
  }
  const requests = await PushAPI.chat.requests({
    account: `eip155:${address}`,
    toDecrypt: true,
    pgpPrivateKey,
    env: ENV.PROD,
  });
  const formattedConversations = formatConversationsPush({
    conversations: requests,
    isRequest: true,
  });
  return formattedConversations;
};

export const approveRequestPush = async ({
  to,
  userAddress,
  signer,
  pgpPrivateKey,
}: {
  to: string;
  userAddress: string;
  signer: Signer;
  pgpPrivateKey: string;
}): Promise<void> => {
  await PushAPI.chat.approve({
    status: "Approved",
    account: userAddress,
    senderAddress: to,
    env: ENV.PROD,
    pgpPrivateKey,
    signer,
  });
};
