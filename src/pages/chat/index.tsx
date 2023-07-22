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
} from "libs";
import Router from "next/router";
import { JsonRpcSigner } from "@ethersproject/providers";
import { useAccount } from "wagmi";

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

  useEffect(() => {
    if (!xmtp || !signer) {
      Router.push("/");
      return;
    }
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

  return (
    <>
      <div className="h-screen">
        <main className="flex h-full">
          <div className="w-full h-full rounded-md bg-telegram-gray-300 shadow-lg shadow-gray-800 ">
            <header></header>
            <div className="grid grid-cols-3 h-full">
              <div className="col-span-1 overflow-hidden">
                <div className="flex items-center bg-telegram-gray-300 pl-2">
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
                      className="w-full text-white text-xs p-2.5 rounded-sm outline-none bg-telegram-gray-200"
                    />
                  </div>
                </div>
                <div className="overflow-y-scroll h-full">
                  {xmtp && connversations && connversations.length > 0 ? (
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
              <div className="flex flex-col justify-between col-span-2">
                <div className="flex items-center justify-between p-2 bg-telegram-gray-300">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <h2 className="font-medium text-white text-sm">
                        {activeConversation?.addressTo}
                      </h2>
                      <p className=" text-telegram-gray-100 text-xs">
                        last message at{" "}
                        {activeConversation?.lastMessageDate.toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-around w-40 text-telegram-gray-100">
                    <SvgGenerator // logo search
                      path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      className="w-5 h-5"
                    />
                    <SvgGenerator // logo phone
                      path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      className="w-5 h-5"
                    />

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

                <div className="relative pb-3 w-full h-full overflow-y-scroll flex justify-end flex-col bg-telegram-gray-400">
                  {filteredMessages.map((message, index) => (
                    <div key={index}>
                      <Messages message={message} />
                    </div>
                  ))}
                </div>
                <div className="flex p-1 bg-telegram-gray-300">
                  <SvgGenerator
                    path="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    className="mx-2 w-7 top-2 left-2 text-telegram-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Write a message..."
                    className="w-full text-white text-xs p-2.5 rounded-md outline-none bg-telegram-gray-300"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button onClick={() => handleSendMessage()}>Send</button>
                  <SvgGenerator
                    path="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    className="mr-1 w-9 top-2 left-2 text-telegram-gray-100"
                  />
                  <SvgGenerator
                    path="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    className="mx-2 w-8 top-2 left-2 text-telegram-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
