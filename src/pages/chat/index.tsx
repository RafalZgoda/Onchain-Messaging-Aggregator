/* eslint-disable react/no-unknown-property */
import ChatCard from "./components/ChatCard";
import Messages from "./components/Messages";
import { useEffect, useState } from "react";
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

export default function Chat({
  xmtp,
  signer,
  pushPGPKey,
}: {
  xmtp: TXMTPClient;
  signer: JsonRpcSigner;
  pushPGPKey: string;
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
    });
    setInputValue("");
    await getMessages();
  };

  const handleSendNewMessage = async () => {
    await sendAggregatedNewMessage({
      addressTo: newMessageAddress,
      message: inputValue,
      xmtp_client: xmtp,
    });
    setInputValue("");
    await refreshConversations();
    setNewMessageModalVisibility(false);
  };

  useEffect(() => {
    //update filtered messages
    const filteredMessages = messages.filter((message) =>
      platformsFilter.includes(message.platform)
    );
    setFilteredMessages(filteredMessages);
  }, [messages, platformsFilter]);

  useEffect(() => {
    if ( !activeConversation || !signer) return;
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xmtp, activeConversation, signer, pushPGPKey]);

  const getMessages = async () => {
    console.log(activeConversation);
    if (!activeConversation) return;
    const userAddress = await signer.getAddress();
    console.log("getting messages");
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
    console.log("getting conversations");
    const conversations = await getAggregatedConversations({
      xmtp_client: xmtp,
      pgpPrivateKey: pushPGPKey,
      userAddress: await signer.getAddress(),
    });
    console.log({conversations});
    setConversations(conversations);
  };

  const refreshConversations = async () => {
    await getConversations();
    await getMessages();
  };

  useEffect(() => {
    if (!signer) return;
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

  return (
    <>
      <div className="h-[calc(100vh-60px)]">
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
          <div className="w-full h-full rounded-md bg-telegram-gray-300 shadow-lg shadow-gray-800 ">
            <div className="grid grid-cols-3 h-full">
              <div className="col-span-1 overflow-hidden">
                <div className="flex items-center bg-[#1F1F23] pl-2">
                  <div className="text-telegram-gray-100">
                    <SvgGenerator
                      path="M4 6h16M4 12h16M4 18h16"
                      className="w-6 h-6 m-2"
                    />
                  </div>
                  <div className="m-2 w-full">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full text-white text-xs p-2.5 rounded-sm outline-none bg-[#1F1F23]"
                    />
                    <button
                      className="cursor-pointer"
                      onClick={() => setNewMessageModalVisibility(true)}
                    >
                      New Message
                    </button>
                  </div>
                </div>
                <div className="overflow-y-scroll h-full">
                  {connversations && connversations.length > 0 ? (
                    connversations.map((conversation, index) => (
                      <div
                        className={`${
                          activeConversation?.addressTo ===
                          conversation.addressTo
                            ? "bg-red-200"
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
                      <p className="text-white text-sm">Loading...</p>
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
                        {/* <p className=" text-telegram-gray-100 text-xs m-0">
                          last message at{" "}
                          {activeConversation?.lastMessageDate.toDateString()}
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="w-40 text-telegram-gray-100 flex justify-end">
                    <button
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
                  </div>
                </div>

                {platformsFilterVisibility && (
                  <div className="flex items-center justify-center bg-telegram-gray-300">
                    <p>Filters:</p>
                    <ul className="flex">
                      <li>
                        <input
                          // all platforms
                          type="checkbox"
                          onChange={() =>
                            setPlatformsFilter(MESSAGE_PLATFORMS_ARRAY)
                          }
                          checked={
                            platformsFilter.length ===
                            MESSAGE_PLATFORMS_ARRAY.length
                          }
                          className="w-3 h-3"
                        />
                        <label>All</label>
                      </li>
                      {MESSAGE_PLATFORMS_ARRAY.map((platform, index) => (
                        <li key={index}>
                          <input
                            type="checkbox"
                            onChange={() => handleFilterPlatform(platform)}
                            checked={platformsFilter.includes(platform)}
                            className="w-3 h-3"
                          />
                          <label>{platform.name}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="relative pb-3 w-full h-full overflow-y-scroll flex justify-end flex-col bg-[#26282D]">
                  {filteredMessages.map((message, index) => (
                    <div key={index}>
                      <Messages message={message} />
                    </div>
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
