export type TMessage = {
  id: string;
  senderAddress: string;
  recipientAddress: string;
  sent: Date;
  content: string;
  platform: string;
};

export type TConversationsPreview = {
  id: string;
  addressTo: string;
  platform: string;
};
