/* eslint-disable react/no-unknown-property */
import ChatCard from "./components/ChatCard";
import Messages from "./components/Messages";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import React from "react";
import {
  TXMTPClient,
  getAggregatedConversations,
  getAggregatedMessages,
  TConversation,
  TMessage,
  TMessagePlatform,
  MESSAGE_PLATFORMS_ARRAY,
  sendAggregatedMessage,
  sendAggregatedNewMessage,
} from "@/libs";

import { JsonRpcSigner } from "@ethersproject/providers";
import { Button, Input, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Checkbox } from "@mantine/core";
import { useRouter } from "next/router";
import EnsNameAvatar from "./components/EnsNameAvatar";

export default function Chat({
  xmtp,
  signer,
  pushPGPKey,
}: {
  xmtp: TXMTPClient;
  signer: JsonRpcSigner;
  pushPGPKey: string;
}) {
  const router = useRouter();
  useEffect(() => {
    if (!signer) {
      router.push("/");
    }
  }, [signer]);

  const [connversations, setConversations] = useState<TConversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<TConversation>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<TMessage[]>([]);
  const [platformsFilter, setPlatformsFilter] = useState<TMessagePlatform[]>(
    MESSAGE_PLATFORMS_ARRAY
  );
  const [platformsFilterVisibility, setPlatformsFilterVisibility] =
    useState(true);
  const [inputValue, setInputValue] = useState("");

  const [newMessageModalVisibility, setNewMessageModalVisibility] =
    useState(false);
  const [newMessageAddress, setNewMessageAddress] = useState("");

  useEffect(() => {
    if (!signer) return;
    getConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xmtp, signer, pushPGPKey]);

  const handleFilterPlatform = (platform: TMessagePlatform) => {
    if (platformsFilter.includes(platform)) {
      setPlatformsFilter(
        platformsFilter.filter((platformFilter) => platformFilter !== platform)
      );
    } else {
      setPlatformsFilter([...platformsFilter, platform]);
    }
  };

  const handlerActiveConversation = (conversation: TConversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = async () => {
    await sendAggregatedMessage({
      conversation_xmtp: activeConversation.conversation_xmtp,
      message: inputValue,
      signer,
      pgpPrivateKey: pushPGPKey,
      otherAddress: activeConversation.addressTo,
      userAddress: await signer.getAddress(),
      conversation_push_request: activeConversation.conversation_push_request,
    });
    setInputValue("");
    await refreshConversations();
  };

  const handleSendNewMessage = async () => {
    if (
      !newMessageAddress ||
      !inputValue ||
      newMessageAddress === signer._address
    )
      return;
    await sendAggregatedNewMessage({
      addressTo: newMessageAddress,
      message: inputValue,
      xmtp_client: xmtp,
    });
    setInputValue("");
    await refreshConversations();
    setNewMessageModalVisibility(false);
    close();
  };

  useEffect(() => {
    //update filtered messages
    const filteredMessages = messages.filter((message) =>
      platformsFilter.includes(message.platform)
    );
    setFilteredMessages(filteredMessages);
  }, [messages, platformsFilter]);

  useEffect(() => {
    if (!activeConversation || !signer) return;
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xmtp, activeConversation, signer, pushPGPKey]);

  const getMessages = async () => {
    if (!activeConversation) return;
    const userAddress = await signer.getAddress();
    const messages = await getAggregatedMessages({
      conversation_xmtp: activeConversation?.conversation_xmtp,
      userAddress,
      conversation_push: activeConversation?.conversation_push,
      conversation_push_request: activeConversation?.conversation_push_request,
      pgpPrivateKey: pushPGPKey,
      otherAddress: activeConversation?.addressTo,
    });
    setMessages(messages);
  };

  const getConversations = async () => {
    const conversations = await getAggregatedConversations({
      xmtp_client: xmtp,
      pgpPrivateKey: pushPGPKey,
      userAddress: await signer.getAddress(),
    });
    if (activeConversation) {
      const activeConversationInNewConversations = conversations.find(
        (conversation) =>
          conversation.addressTo === activeConversation.addressTo
      );
      if (activeConversationInNewConversations) {
        setActiveConversation(activeConversationInNewConversations);
      }
    }
    setConversations(conversations);
  };

  const refreshConversations = async () => {
    const newActiveConversation = connversations.find(
      (conversation) => conversation.addressTo === activeConversation?.addressTo
    );
    setActiveConversation(newActiveConversation);
    await getConversations();
    await getMessages();
  };

  // set interval which click on refresh button (using id) every 10 seconds
  useEffect(() => {
    if (!signer) return;
    const interval = setInterval(() => {
      document.getElementById("refreshBtn").click();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const SvgGenerator = (props) => {
    const { path, className } = props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
      </svg>
    );
  };
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <div className="h-[calc(100vh-60px)] ">
        <Modal opened={opened} onClose={close} title="New Conversation">
          <Input
            type="text"
            placeholder="Address"
            onChange={(e) => setNewMessageAddress(e.target.value)}
            className="w-full text-white text-xs p-2.5 rounded-sm outline-none "
          />
          <Input
            type="text"
            placeholder="Message"
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full text-white text-xs p-2.5 rounded-sm outline-none"
          />
          <Button className="cursor-pointer ml-3 mr-3" onClick={close}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => handleSendNewMessage()}
          >
            Send
          </Button>
        </Modal>
        {newMessageModalVisibility && (
          <div className="absolute z-10 w-full bg-black/70 flex justify-center items-center">
            <div className="bg-white/10 w-[34rem] h-[24rem] flex-row">
              <p>New mesage:</p>
              <input
                type="text"
                placeholder="Address"
                onChange={(e) => setNewMessageAddress(e.target.value)}
                className="w-full text-white text-xs p-2.5 rounded-sm outline-none bg-telegram-gray-200"
              />
              <input
                type="text"
                placeholder="Message"
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full text-white text-xs p-2.5 rounded-sm outline-none bg-telegram-gray-200"
              />
              <button
                className="cursor-pointer"
                onClick={() => setNewMessageModalVisibility(false)}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer"
                onClick={() => handleSendNewMessage()}
              >
                Send
              </button>
            </div>
          </div>
        )}
        <main className="flex h-full">
          <div className="w-full h-full rounded-md bg-[#1f1f23] shadow-lg shadow-gray-800 ">
            <div className="grid grid-cols-3 h-full">
              <div className="col-span-1 overflow-hidden">
                <div className="flex items-center bg-[#1F1F23] pl-2">
                  <div className="bg-[#1f1f23]"></div>
                  <div className="m-2 w-full flex">
                    <Input
                      type="text"
                      placeholder="Search a conversation"
                      className="w-full text-white text-xs p-2.5 rounded-sm outline-none bg-[#1F1F23]"
                      onChange={(e) => {
                        setConversations(
                          connversations.filter(
                            (conversation) =>
                              conversation.addressTo.includes(e.target.value) ||
                              conversation.ensNameTo?.includes(e.target.value)
                          )
                        );
                      }}
                    />
                    <Tooltip label="Start a new conversation">
                      <button
                        className="cursor-pointer text-gray-300 rounded-[100px] border-none bg-transparent px-[10px] py-2"
                        onClick={open}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                    <button
                      className="invisible w-0 h-0"
                      id="refreshBtn"
                      onClick={() => refreshConversations()}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="overflow-y-scroll h-full">
                  {connversations && connversations.length > 0 ? (
                    connversations.map((conversation, index) => (
                      <div
                        className={`rounded-2xl ml-5 ${
                          activeConversation?.addressTo ===
                          conversation.addressTo
                            ? "bg-[#222226]"
                            : ""
                        }`}
                        onClick={() => handlerActiveConversation(conversation)}
                        key={index}
                      >
                        <ChatCard conversation={conversation} />
                      </div>
                    ))
                  ) : (
                    //put some skeleton here
                    <div className="flex items-center justify-center h-full">
                      <Loader className="block mx-auto" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between col-span-2 m-5">
                <div className="flex items-center justify-between px-5 pt-3 bg-[#26282D] rounded-t-[30px] border-b">
                  {activeConversation?.addressTo && (
                    <>
                      <EnsNameAvatar address={activeConversation?.addressTo} />

                      <div className="w-40 text-telegram-gray-100 flex justify-end">
                        <button
                          className="border-none bg-transparent cursor-pointer items-center"
                          onClick={() => {
                            setPlatformsFilterVisibility(
                              !platformsFilterVisibility
                            );
                          }}
                        >
                          <SvgGenerator // logo params
                            path="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            className="w-5 h-5"
                          />
                        </button>

                        {/* <MultiSelect
                      className="w-[200px]"
                        data={defaultFilters}
                         value={filters} onChange={setFilters}
                        placeholder="Protocol Filter"
                      /> */}
                      </div>
                    </>
                  )}
                </div>

                {connversations &&
                  connversations.length &&
                  activeConversation &&
                  platformsFilterVisibility && (
                    <div className="flex items-center justify-end bg-[#26282d]">
                      <ul className="flex">
                        <p className="mr-10 flex">
                          <Checkbox
                            onChange={() =>
                              setPlatformsFilter(MESSAGE_PLATFORMS_ARRAY)
                            }
                            checked={
                              platformsFilter.length ===
                              MESSAGE_PLATFORMS_ARRAY.length
                            }
                            className="w-3 h-3 mr-5"
                          />
                          <label>All</label>
                        </p>
                        {MESSAGE_PLATFORMS_ARRAY.map((platform, index) => (
                          <p key={index} className="mr-10 flex">
                            <Checkbox
                              onChange={() => handleFilterPlatform(platform)}
                              checked={platformsFilter.includes(platform)}
                              className="w-3 h-3 mr-5"
                            />
                            <label>{platform.name}</label>
                          </p>
                        ))}
                      </ul>
                    </div>
                  )}

                <div
                  className={`relative pb-3 w-full h-full overflow-y-scroll flex justify-${
                    activeConversation?.addressTo ? "end" : "center"
                  } flex-col bg-[#26282D] px-8 gap-2`}
                >
                  {activeConversation?.addressTo ? (
                    filteredMessages.map((message, index) => (
                      <Messages key={index} message={message} />
                    ))
                  ) : (
                    <h2 className="text-center">Select a conversation</h2>
                  )}
                </div>
                <div className="flex p-1 bg-[#26282D] rounded-b-[30px] px-5 pb-3 pt-5">
                  {activeConversation?.addressTo && (
                    <>
                      <input
                        type="text"
                        placeholder="Write a message..."
                        className="w-full text-white text-xs p-2.5 rounded-md outline-none bg-[#3F4249] border-none mx-5"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        className="bg-[#3C8AFF] border-none rounded-[100px] h-8 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 mt-[2px]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
