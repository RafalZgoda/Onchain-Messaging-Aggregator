import { providers, Signer } from "ethers";
import {
  MESSAGE_PLATFORMS,
  TMessagePlatform,
  initXMTPClient,
  MESSAGE_PLATFORMS_ARRAY,
  TXMTPClient,
  getUserPush,
  createUserPush,
  decryptPGPKeyPush,
} from "libs";
import Image from "next/image";
import { useState, useEffect } from "react";
const Protocol = ({
  setXmtp,
  xmtp,
  signer,
  platform,
  setPushPGPKey,
  pushPGPKey,
}: {
  setXmtp: any;
  xmtp: TXMTPClient;
  signer: providers.JsonRpcSigner;
  platform: TMessagePlatform;
  setPushPGPKey: any;
  pushPGPKey: string;
}) => {
  const [isProtocolSet, setIsProtocolSet] = useState(false);

  useEffect(() => {
    updateSetProtocol();
  }, [platform.name, xmtp, pushPGPKey]);

  const updateSetProtocol = () => {
    if (platform.name == MESSAGE_PLATFORMS.xmtp.name && xmtp) {
      setIsProtocolSet(true);
    }
    if (platform.name == MESSAGE_PLATFORMS.vanilla.name) {
      setIsProtocolSet(true);
    }
    if (platform.name == MESSAGE_PLATFORMS.push.name && pushPGPKey) {
      setIsProtocolSet(true);
    }
  };

  const handleSetPlatform = async (platform: TMessagePlatform) => {
    if (isProtocolSet) return;
    switch (platform.name) {
      case MESSAGE_PLATFORMS.vanilla.name:
        break;
      case MESSAGE_PLATFORMS.push.name:
        await handleInitPush();
        break;
      case MESSAGE_PLATFORMS.xmtp.name:
        await handleInitXmtp();
        break;
      default:
        break;
    }
  };

  const handleInitXmtp = async () => {
    const xmtp = await initXMTPClient({ signer });
    setXmtp(xmtp);
    // localStorage.setItem("xmtp", JSON.stringify(xmtp));
  };

  const handleInitPush = async () => {
    const userAddress = await signer.getAddress();
    let user = await getUserPush(userAddress);
    if (!user) {
      user = await createUserPush({
        address: userAddress,
        signer,
      });
    }
    const { encryptedPrivateKey } = user;
    const privateKey = await decryptPGPKeyPush({
      encryptedPGPPrivateKey: encryptedPrivateKey,
      signer,
    });
    setPushPGPKey(privateKey);
    localStorage.setItem("pushPGPKey", privateKey);
  };

  return (
    <div className="w-64      rounded flex flex-col p-10 items-center justify-end">
      <Image
        width={128}
        height={128}
        src={platform.imgUrl}
        alt={platform.name}
      />
      <h1 className="font-bold mt-3 text-xl text-white">{platform.name}</h1>
      <button
        onClick={() => {
          handleSetPlatform(platform);
        }}
        // className="border-none bg-[#3C8AFF] text-white px-5 py-2 mt-10  rounded-lg cursor-pointer"
        className={`border-none ${
          isProtocolSet ? "bg-[#3C8AFF]" : "bg-[#38383f]"
        } text-white px-5 py-2 mt-10  rounded-lg cursor-pointer hover:bg-[#3c8aff50] transition`}
      >
        {isProtocolSet ? "Enabled ✅" : "Disabled ❌"}
      </button>
    </div>
  );
};

export const Protocols = ({
  setXmtp,
  signer,
  xmtp,
  pushPGPKey,
  setPushPGPKey,
}: {
  setXmtp: any;
  signer: providers.JsonRpcSigner;
  xmtp: TXMTPClient;
  pushPGPKey: string;
  setPushPGPKey: any;
}) => {
  return (
    <div>
      <div className="flex p-10 justify-center gap-32">
        {MESSAGE_PLATFORMS_ARRAY.map((platform, index) => {
          return (
            <Protocol
              key={index}
              platform={platform}
              setXmtp={setXmtp}
              signer={signer}
              xmtp={xmtp}
              pushPGPKey={pushPGPKey}
              setPushPGPKey={setPushPGPKey}
            />
          );
        })}
      </div>
      <p className="text-center text-white w-8/12 mx-auto">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque eligendi
        adipisci obcaecati quod dolor nihil ipsam dignissimos quasi, quia
        pariatur. Eligendi, quaerat eveniet rem voluptas reiciendis maiores?
        Quis, molestias iste?
      </p>
    </div>
  );
};
