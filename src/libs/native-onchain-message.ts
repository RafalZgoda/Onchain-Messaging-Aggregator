import { ethers } from "ethers";
import axios from "axios";
import "dotenv/config";
import { TMessage, TConversation } from "./types";
async function sendMessage(
  provider: ethers.providers.Web3Provider,
  recipient: string,
  message: string
): Promise<ethers.providers.TransactionReceipt> {
  // Instantiate a new ethers.js contract object
  const signer = provider.getSigner();

  // Convert the message to hexadecimal
  const messageHex = ethers.utils.formatBytes32String(message);

  // Set up the transaction
  const transaction = {
    to: recipient,
    data: messageHex,
  };

  // Send the transaction and wait for it to be mined
  const txResponse = await signer.sendTransaction(transaction);
  const txReceipt = await provider.waitForTransaction(txResponse.hash);

  return txReceipt;
}

function isOnchainMessage(tx: any): string | null {
  try {
    const message = ethers.utils.toUtf8String(tx.input);
    // Assume that valid messages must be non-empty strings
    if (message.length > 0) {
      return message;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// const filterReceivedMessage = (address: string) => {
//   return (tx: any) => tx.to === address;
// };

// const filterSendMessage = (address: string) => {
//   return (tx: any) => tx.from === address;
// };

const getAllTxs = async (address: string) => {
  console.log({ etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY });
  const { data } = await axios.get(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
  );

  return data.result;
};

const getAllRawMessages = async (address: string): Promise<TMessage[]> => {
  address = address.toLowerCase();
  const txs = await getAllTxs(address);

  if (txs.length === 0) return [];
  console.log({ txs });

  const messages: TMessage[] = txs
    .map((tx: any) => {
      const message = isOnchainMessage(tx);
      if (
        tx.contractAddress !== "" ||
        tx.input === "0x" ||
        tx.functionName !== ""
      ) {
        // console.log({ contrcat: tx.contractAddress });
        return null;
      }
      return {
        // ...tx,
        id: tx.hash,
        senderAddress: tx.from,
        recipientAddress: tx.to,
        // value: tx.value,
        sentAt: new Date(parseInt(tx.timeStamp) * 1000),
        content: message,

        me: tx.from.toLowerCase() === address,
        platform: "native",
      };
    })
    .filter((tx: any) => tx !== null);

  // const receivedMessages = messages.filter((tx: any) => {
  //   // console.log({ tx, bool: tx.to === address });
  //   return tx.to === address && tx.message !== null;
  // });

  // const sendMessages = messages.filter((tx: any) => {
  //   // console.log({ tx, bool: tx.to === address });
  //   return tx.from === address && tx.message !== null;
  // });

  // // console.log({ messages, receivedMessages });
  // console.log({ receivedMessages });
  console.log({ messages });
  return messages;
};

// getAllRawMessages("0xb66cd966670d962C227B3EABA30a872DbFb995db");

// isContract("0x6B175474E89094C44Da98b954EedeAC495271d0F");

// export const getAllConversationsFromNativeOnchain = async (
//   owner: string
// ): Promise<TConversation[]> => {
//   console.log({ owner });
//   const messages = await getAllRawMessages(owner);

//   // create a map to store the latest message for each address
//   const addressToLatestMessageMap: { [key: string]: any } = {};

//   messages.forEach((msg: TMessage) => {
//     msg.lastMessageDate =  new Date(msg.sentAt),
//     msg.addressTo = msg.recipientAddress,

//     const otherParty =
//       msg.senderAddress === owner ? msg.recipientAddress : msg.senderAddress;

//       msg.content = msg.content.replace(/[^a-zA-Z0-9 ]/g, "");
//     // if this is the first message from this address, or if this message is more recent than the stored one
//     if (
//       !addressToLatestMessageMap[otherParty] ||
//       addressToLatestMessageMap[otherParty].sentAt < msg.sentAt
//     ) {
//       addressToLatestMessageMap[otherParty] = msg;
//     }
//   });

//   // convert the map to an array of messages
//   const conversations: TConversation[] = Object.values(
//     addressToLatestMessageMap
//   );

//   return conversations;
// };

export const getAllConversationsFromNativeOnchain = async (
  owner: string
): Promise<TConversation[]> => {
  console.log({ owner });
  const messages = await getAllRawMessages(owner);

  const conversations: TConversation[] = messages.map((msg) => ({
    addressTo: msg.to,
    lastMessageDate: new Date(msg.timestamp), // assuming the timestamp is in a format that the Date constructor can interpret
  }));

  return conversations;
};

// getMessagesFromNativeOnchain("0xb66cd966670d962C227B3EABA30a872DbFb995db");
export const getConversationFromNativeOnchain = async (
  owner: string,
  other: string
): Promise<TMessage[]> => {
  const messages = await getAllRawMessages(owner);
  const conversationRaw = messages.filter(
    (msg: any) =>
      (msg.senderAddress.toLowerCase() === owner.toLowerCase() &&
        msg.recipientAddress.toLowerCase() === other.toLowerCase()) ||
      (msg.senderAddress.toLowerCase() === other.toLowerCase() &&
        msg.recipientAddress.toLowerCase() === owner.toLowerCase())
  );
  // const conversation: TConversation[] = conversationRaw.map((msg) => {
  //   return {
  //     id: msg.hash,
  //     senderAddress: msg.from,
  //     recipientAddress: msg.to,
  //     // value: tx.value,
  //     sentAt: new Date(parseInt(tx.timeStamp) * 1000),
  //     content: message,

  //     me: tx.from.toLowerCase() === address,
  //     platform: "native",

  //     id: msg.id, // assuming msg object has id
  //     addressTo: msg.recipientAddress,
  //     platform: msg.platform, // assuming msg object has platform
  //     imgUrl: "msg.imgUrl", // assuming msg object has imgUrl
  //     lastMessageDate: new Date(
  //       conversationRaw[conversationRaw.length - 1].sentAt
  //     ), // assuming msg object has timestamp
  //     owner,
  //   };
  // });

  // console.log({ conversation });
  return conversationRaw;
};

// getConversationFromNativeOnchain(
//   "0xb66cd966670d962C227B3EABA30a872DbFb995db",
//   "0x0bf93ea5a1fa4ce3dd22c7ffd314462d3869777f"
// );
