import * as PushAPI from "@pushprotocol/restapi";
import { Signer, ethers } from "ethers";
import * as dotenv from "dotenv";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
dotenv.config();

export type TMessage = {
  id: string;
  senderAddress: string;
  recipientAddress: string;
  sent: Date;
  content: string;
  platform: string;
};

const createUser = async (address: string, signer: Signer) => {
  return await PushAPI.user.create({
    env: ENV.STAGING,
    account: `eip155:${address}`,
    signer,
    progressHook: (progress) => console.log("Progress: ", progress),
  });
};

const getUser = async (address: string) => {
  return await PushAPI.user.get({
    account: `eip155:${address}`,
    env: ENV.STAGING,
  });
};

const decryptPGPKey = async (
  encryptedPGPPrivateKey: string,
  signer: Signer
) => {
  return await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey,
    signer,
  });
};

const getAllChats = async (address: string, pgpPrivateKey: string) => {
  return await PushAPI.chat.chats({
    account: `eip155:${address}`,
    toDecrypt: true,
    pgpPrivateKey,
    env: ENV.STAGING,
  });
};

const getMessages = async (
  threadhash: string,
  address: string,
  pgpPrivateKey: string
): Promise<TMessage[]> => {
  const response = await PushAPI.chat.history({
    threadhash,
    pgpPrivateKey,
    account: `eip155:${address}`,
    toDecrypt: true,
    env: ENV.STAGING,
  });
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
      sent: new Date(message.timestamp as number),
      platform: "push",
    };
  });
};

const sendMessage = async (
  to: string,
  message: string,
  signer: Signer,
  pgpPrivateKey: string
) => {
  return await PushAPI.chat.send({
    messageContent: message,
    messageType: "Text", // can be "Text" | "Image" | "File" | "GIF"
    receiverAddress: `eip155:${to}`,
    signer,
    pgpPrivateKey,
    env: ENV.STAGING,
  });
};

export const getRequests = async (address: string, pgpPrivateKey: string) => {
  return await PushAPI.chat.requests({
    account: `eip155:${address}`,
    toDecrypt: true,
    pgpPrivateKey,
    env: ENV.STAGING,
  });
};

export const approveRequest = async (
  from: string,
  address: string,
  signer: Signer,
  pgpPrivateKey: string
) => {
  await PushAPI.chat.approve({
    status: "Approved",
    account: address,
    senderAddress: from,
    env: ENV.STAGING,
    pgpPrivateKey,
    signer,
  });
};

(async () => {
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const signer2 = new ethers.Wallet(process.env.PRIVATE_KEY_2!);
  const signer3 = new ethers.Wallet(process.env.PRIVATE_KEY_3!);
  const user = await getUser(process.env.PUBLIC_KEY!);
  const user2 = await getUser(process.env.PUBLIC_KEY_2!);
  const user3 = await getUser(process.env.PUBLIC_KEY_3!);

  //   await approveRequest(process.env.PUBLIC_KEY, process.env.PUBLIC_KEY_2, user2, signer2);

  //   const requests = await getRequests(user, process.env.PUBLIC_KEY, signer);
  //   const requests2 = await getRequests(user2, process.env.PUBLIC_KEY_2, signer2);

  //   console.log({ requests });
  //   console.log({ requests2 });

  //   await sendMessage(
  //     process.env.PUBLIC_KEY_2,
  //     "Hello from first user"
  //     user,
  //     signer,
  //   );
  // await sendMessage(
  //   process.env.PUBLIC_KEY_3,
  //   "Hello from user 2"
  //   user2,
  //   signer2,
  // );

  //   const chats2 = await getAllChats(user2, process.env.PUBLIC_KEY_2, signer2);
  //   const chats = await getAllChats(user, process.env.PUBLIC_KEY, signer);
  // await approveRequest(
  //   process.env.PUBLIC_KEY_2,
  //   user3,
  //   process.env.PUBLIC_KEY_3,
  //   signer3
  // );
  const pgpPrivateKey1 = await decryptPGPKey(user.encryptedPrivateKey, signer);
  const pgpPrivateKey2 = await decryptPGPKey(
    user2.encryptedPrivateKey,
    signer2
  );
  const pgpPrivateKey3 = await decryptPGPKey(
    user3.encryptedPrivateKey,
    signer3
  );

  const chats3 = await getAllChats(process.env.PUBLIC_KEY_3!, pgpPrivateKey3);
  console.log(chats3);
  console.log(
    await getMessages(
      chats3[0].threadhash!,
      process.env.PUBLIC_KEY_3!,
      pgpPrivateKey3
    )
  );

  //   console.log({ chats });
  //   console.log({ chats2 });
  //   const messages = await getMessages(
  //     chats[0].threadhash,
  //     user2,
  //     process.env.PUBLIC_KEY,
  //     signer2
  //   );
  //   console.log({ messages });
})();
