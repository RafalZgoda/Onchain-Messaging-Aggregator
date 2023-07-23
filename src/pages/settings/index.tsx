import { Logo } from "components/Logo";
import { useState, useEffect } from "react";
import { Protocols } from "./components/protocols";
import { TUserProfile, TXMTPClient } from "@/libs";
import { Profile } from "./components/profile";
import { providers } from "ethers";
import { useRouter } from "next/router";
import { Preferences } from "./components/preferences";


export default function Settings({
  myProfile,
  setXmtp,
  signer,
  xmtp,
  pushPGPKey,
  setPushPGPKey,
  isWorldcoinFilterChecked,
  setIsWorldcoinFilterChecked,
}: {
  myProfile: TUserProfile;
  setXmtp: any;
  signer: providers.JsonRpcSigner;
  xmtp: TXMTPClient;
  pushPGPKey: string;
  setPushPGPKey: any;
  isWorldcoinFilterChecked: boolean;
  setIsWorldcoinFilterChecked: any;
}) {
  const activeTabCSS = "bg-[#26282d]";
  const [activeTab, setActiveTab] = useState("Profile");
  const router = useRouter();
  useEffect(() => {
    if (!signer) {
      router.push("/");
    }
  }, [signer]);

  return (
    <div className="w-full h-screen flex">
      <div className="w-2/12 bg-[#1F1F23] flex flex-col p-5">
        <nav className="flex flex-col gap-5 text-white text-md">
          <div
            onClick={() => {
              router.push("/chat");
            }}
            className={`cursor-pointer hover:bg-[#26282d] transition flex items-center p-3 rounded-xl`}
          >
            <div className="flex font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                className="w-6 h-6 mr-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
              Back to Chats
            </div>
          </div>
          <hr className="border-none bg-[#ffffff20] w-full h-0.5" />
          <a
            onClick={() => setActiveTab("Profile")}
            className={`cursor-pointer hover:bg-[#26282d] transition flex items-center p-3 rounded-xl ${
              activeTab == "Profile" ? activeTabCSS : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            Profile
          </a>
          <a
            onClick={() => setActiveTab("Protocols")}
            className={`cursor-pointer hover:bg-[#26282d] transition flex items-center p-3 rounded-xl ${
              activeTab == "Protocols" ? activeTabCSS : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 mr-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
            Apps
          </a>

          <a
            onClick={() => setActiveTab("Preferences")}
            className={`cursor-pointer hover:bg-[#26282d] transition flex items-center p-3 rounded-xl ${
              activeTab == "Preferences" ? activeTabCSS : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
              />
            </svg>
            Preferences
          </a>
        </nav>
      </div>
      <div className="bg-[#26282D] w-full flex h-screen justify-center pt-10">
        {activeTab == "Protocols" && (
          <Protocols
            setXmtp={setXmtp}
            signer={signer}
            xmtp={xmtp}
            pushPGPKey={pushPGPKey}
            setPushPGPKey={setPushPGPKey}
          />
        )}
        {activeTab == "Profile" && (
          <Profile profile={myProfile} signer={signer} />
        )}
        {activeTab == "Preferences" && (
          <Preferences
            isWorldcoinFilterChecked={isWorldcoinFilterChecked}
            setIsWorldcoinFilterChecked={setIsWorldcoinFilterChecked}
          />
        )}
      </div>
    </div>
  );
}
