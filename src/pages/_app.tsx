import "../../styles/globals.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect, useState } from "react";
import { type WalletClient } from "@wagmi/core";
import { watchWalletClient } from "@wagmi/core";
import { Platform, getEthersSigner, getUserOnChainData } from "libs";
import { providers } from "ethers";
import Layout from "@/components/Layout";
import { RouterTransition } from "@/components/RouterTransition";
const config = createConfig(
  getDefaultConfig({
    appName: "Message aggregator",
    alchemyId: "MzUaa0A87yexjd8UKcHm8HIr1f4aghxT",
    walletConnectProjectId: "a8024e8262cb4e7102941a3577b5a5c0",
  })
);

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  const [xmtp, setXmtp] = useState(null);
  const [wallet, setWallet] = useState<WalletClient>(null);
  const [signer, setSigner] = useState<providers.JsonRpcSigner>(null);
  const [myProfile, setMyProfile] = useState(null);
  const [pushPGPKey, setPushPGPKey] = useState("");
  useEffect(() => setMounted(true), []);

  const unwatch = watchWalletClient(
    {
      chainId: 1,
    },
    (walletClient) => {
      setWallet(walletClient);
    }
  );

  const getProfile = async () => {
    const profile = await getUserOnChainData(
      await signer.getAddress(),
      Platform.ethereum
    );
    setMyProfile(profile);
  };

  const updateSigner = async () => {
    const signer = await getEthersSigner({ chainId: 1 });
    setSigner(signer);
  };

  useEffect(() => {
    updateSigner();
    if (!wallet) {
      emptyMessagingClient();
      localStorage.removeItem("xmtp");
      localStorage.removeItem("pushPGPKey");
    }
  }, [wallet]);

  useEffect(() => {
    if (signer) {
      getProfile();
    }
  }, [signer]);

  const emptyMessagingClient = () => {
    console.log("emptying messaging client");
    setXmtp(null);
    setPushPGPKey("");
  };

  // check if local storage has xmtp
  useEffect(() => {
    const xmtp = localStorage.getItem("xmtp");
    if (xmtp) {
      setXmtp(JSON.parse(xmtp));
    }
    const pushPGPKey = localStorage.getItem("pushPGPKey");
    if (pushPGPKey) {
      setPushPGPKey(pushPGPKey);
    }
  }, []);

  // useEffect(() => {
  //   console.log({ pushPGPKey });
  // }, [pushPGPKey]);

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
          }}
        >
          <RouterTransition />
          <Head>
            <title>S3ND</title>
            <meta name="MSG" content="Web3 messaging aggregator" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Layout>
            {mounted && (
              <Component
                {...pageProps}
                wallet={wallet}
                signer={signer}
                xmtp={xmtp}
                setXmtp={setXmtp}
                myProfile={myProfile}
                pushPGPKey={pushPGPKey}
                setPushPGPKey={setPushPGPKey}
              />
            )}
          </Layout>
        </MantineProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
