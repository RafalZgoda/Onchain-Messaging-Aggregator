import "../../styles/globals.css";
import Head from "next/head";
import Layout from "@/components/Layout";
import { MantineProvider } from "@mantine/core";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect, useState } from "react";
import { NavigationProgress } from "@mantine/nprogress";
import { RouterTransition } from "@/components/RouterTransition";
import { type WalletClient } from "@wagmi/core";
import { watchWalletClient } from "@wagmi/core";
import { getEthersSigner } from "libs";
import { providers } from "ethers";
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
  useEffect(() => setMounted(true), []);

  const unwatch = watchWalletClient(
    {
      chainId: 1,
    },
    (walletClient) => {
      setWallet(walletClient);
    }
  );

  const updateSigner = async () => {
    const signer = await getEthersSigner({ chainId: 1 });
    setSigner(signer);
  };

  useEffect(() => {
    updateSigner();
    if (!wallet) {
      emptyMessagingClient();
    }
  }, [wallet]);

  const emptyMessagingClient = () => {
    setXmtp(null);
  };

  // check if local storage has xmtp
  useEffect(() => {
    const xmtp = localStorage.getItem("xmtp");
    if (xmtp) {
      setXmtp(JSON.parse(xmtp));
    }
  }, []);

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
						<title>MSG</title>
						<meta name="MSG" content="Web3 messaging aggregator" />
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<Layout>{mounted && <Component {...pageProps} wallet={wallet}
              signer={signer}
              xmtp={xmtp}
              setXmtp={setXmtp} />}</Layout>
				</MantineProvider>
			</ConnectKitProvider>
		</WagmiConfig>
	);
}

export default MyApp;
