import ChatCard from "./components/ChatCard";
import Messages from "./components/Messages";
import { MultiSelect } from '@mantine/core';
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
} from "libs";

import { JsonRpcSigner } from "@ethersproject/providers";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import EnsNameAvatar from "./components/ENSNameAvatar";
import { Button, Input, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";import { Checkbox } from '@mantine/core';

const defaultFilters = ["push", "xmtp", "vanilla"];

export default function Chat({
  xmtp,
  signer,
}: {
  xmtp: TXMTPClient;
  signer: JsonRpcSigner;
}) {
  const [connversations, setConversations] = useState<TConversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<TConversation>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<TMessage[]>([]);
  const [platformsFilter, setPlatformsFilter] = useState<TMessagePlatform[]>(
    MESSAGE_PLATFORMS_ARRAY
  );
  const [platformsFilterVisibility, setPlatformsFilterVisibility] =
    useState(false);
  const [inputValue, setInputValue] = useState("");
  const [ensAvartUrl, setEnsAvartUrl] = useState("");

  const [newMessageModalVisibility, setNewMessageModalVisibility] =
    useState(false);
  const [newMessageAddress, setNewMessageAddress] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  useEffect(() => {
    if (!xmtp || !signer) return;
    getConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xmtp, signer]);

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
    });
    setInputValue("");
    await getMessages();
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

  const handleFilters = () => {
    if (!activeConversation) return;
    const filteredMessages = messages.filter((message) => filters.includes(message.platform.id));
    console.log(filters)
    setFilteredMessages(filteredMessages);
  };

  useEffect(() => {
    //update filtered messages
    const filteredMessages = messages.filter((message) =>
      platformsFilter.includes(message.platform)
    );
    setFilteredMessages(filteredMessages);
  }, [messages, platformsFilter]);

  useEffect(() => {
    if (!xmtp || !activeConversation || !signer) return;
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xmtp, activeConversation, signer]);

  const getMessages = async () => {
    if (!activeConversation) return;
    const userAddress = await signer.getAddress();
    const messages = await getAggregatedMessages({
      conversation_xmtp: activeConversation?.conversation_xmtp,
      userAddress,
    });
    setMessages(messages);
  };

  const getConversations = async () => {
    const conversations = await getAggregatedConversations({
      xmtp_client: xmtp,
    });
    setConversations(conversations);
  };

  const refreshConversations = async () => {
    await getConversations();
    await getMessages();
  };

  useEffect(() => {
    if (!xmtp || !signer) return;
    const interval = setInterval(async () => {
      await refreshConversations();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xmtp, signer, activeConversation]);

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
                  <div className="m-2 w-full">
                    <Input
                      type="text"
                      placeholder="Search a conversation"
                      className="w-full text-white text-xs p-2.5 rounded-sm outline-none bg-[#1F1F23]"
                      onChange={(e) => {
                        setConversations(
                          connversations.filter((conversation) =>
                            conversation.addressTo.includes(e.target.value)
                          )
                        );
                      }}
                    />
                    <Tooltip label="Start a new conversation">
                      <button
                        className="cursor-pointer absolute bottom-5 left-5 rounded-[100px] border-none bg-[#3C8AFF] px-[10px] py-2"
                        onClick={open}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="overflow-y-scroll h-full">
                  {xmtp && connversations && connversations.length > 0 ? (
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
                  <div className="flex items-center">
                    <div className="ml-2 flex items-center">
                      <img
                        className="rounded-full w-10 h-10 mr-3"
                        src={ensAvartUrl ?? "/img/eth.png"}
                      ></img>
                      <div>
                        <h2 className="font-medium text-white text-sm m-0">
                          {activeConversation?.addressTo}
                        </h2>
                        <p className=" text-telegram-gray-100 text-xs m-0">
                          last message{" "}
                          {new Date().toDateString() ===
                          activeConversation?.lastMessageDate.toDateString()
                            ? activeConversation?.lastMessageDate.toLocaleTimeString()
                            : activeConversation?.lastMessageDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
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
                </div>

                {platformsFilterVisibility && (
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

                <div className="relative pb-3 w-full h-full overflow-y-scroll flex justify-end flex-col bg-[#26282D] px-8 gap-2">
                  {filteredMessages.map((message, index) => (
                    <Messages key={index} message={message} />
                  ))}
                </div>
                <div className="flex p-1 bg-[#26282D] rounded-b-[30px] px-5 pb-3">
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
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 mt-[2px]"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
