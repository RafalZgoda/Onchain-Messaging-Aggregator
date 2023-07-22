import { ethers } from "ethers";
import axios from "axios";
import "dotenv/config";

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
  const { data } = await axios.get(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
  );

  return data.result;
};

const main = async (address: string) => {
  address = address.toLowerCase();
  const txs = await getAllTxs(address);

  // console.log({ txs });
  const messages = txs
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
        messageId: tx.hash,
        from: tx.from,
        to: tx.to,
        // value: tx.value,
        message,
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
  return messages;
};

// main("0xb66cd966670d962C227B3EABA30a872DbFb995db");

// isContract("0x6B175474E89094C44Da98b954EedeAC495271d0F");

const getMessageBox = async (owner: string) => {
  const messages = await main(owner);

  // create a map to store the latest message for each address
  const addressToLatestMessageMap: { [key: string]: any } = {};

  messages.forEach((msg: any) => {
    const otherParty = msg.from === owner ? msg.to : msg.from;

    // if this is the first message from this address, or if this message is more recent than the stored one
    if (
      !addressToLatestMessageMap[otherParty] ||
      addressToLatestMessageMap[otherParty].timeStamp < msg.timeStamp
    ) {
      addressToLatestMessageMap[otherParty] = msg;
    }
  });

  // convert the map to an array of messages
  const conversations = Object.values(addressToLatestMessageMap);

  return conversations;
};

// getMessageBox("0xb66cd966670d962C227B3EABA30a872DbFb995db");
const getConversation = async (owner: string, other: string) => {
  const messages = await main(owner);
  const conversation = messages.filter(
    (msg: any) =>
      (msg.from.toLowerCase() === owner.toLowerCase() &&
        msg.to.toLowerCase() === other.toLowerCase()) ||
      (msg.from.toLowerCase() === other.toLowerCase() &&
        msg.to.toLowerCase() === owner.toLowerCase())
  );

  console.log({ conversation });
  return conversation;
};

getConversation(
  "0xb66cd966670d962C227B3EABA30a872DbFb995db",
  "0x0bf93ea5a1fa4ce3dd22c7ffd314462d3869777f"
);
