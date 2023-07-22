import { Logo } from "components/Logo";
import { useState } from "react";
import { Protocols } from "./components/protocols";
import { TUserProfile } from "libs";
import { Profile } from "./components/profile";

export default function Settings({ myProfile }: { myProfile: TUserProfile }) {
  const activeTabCSS = "bg-[#26282d]";
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="w-full h-screen flex">
      <div className="w-2/12 bg-[#1F1F23] flex flex-col p-5">
        <Logo />
        <nav className="flex flex-col gap-5 mt-10 text-white text-xl">
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
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
              className="w-6 h-6 mr-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            Protocols
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
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
              />
            </svg>
            Preferences
          </a>
        </nav>
      </div>
      <div className="bg-[#26282D] w-full">
        {activeTab == "Protocols" && <Protocols />}
        {activeTab == "Profile" && <Profile profile={myProfile}/> }
      </div>
    </div>
  );
}
