import { TConversationsPreview } from "./types";
import {
  getConversationsListXMTP,
  TXMTPClient,
  TXMTPConversation,
} from "./xmtp-libs";
export const getAggregatedConversations = async function ({
  xmtp_client,
}: {
  xmtp_client: TXMTPClient;
}): Promise<TConversationsPreview[]> {
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
}): TConversationsPreview[] {
  const conversations = conversationsXMTP.map((conversation) => {
    return {
      id: "randomId",
      addressTo: conversation.peerAddress,
      platform: "xmtp",
    };
  });
  return conversations;
};
