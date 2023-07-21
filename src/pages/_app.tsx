import "../../styles/globals.css";
import Head from "next/head";
import Layout from "components/Layout";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect, useState } from "react";

const config = createConfig(
	getDefaultConfig({
		appName: "Message aggregator",
		alchemyId: "MzUaa0A87yexjd8UKcHm8HIr1f4aghxT",
		walletConnectProjectId: "a8024e8262cb4e7102941a3577b5a5c0",
	})
);

function MyApp({ Component, pageProps }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	return (
		<WagmiConfig config={config}>
			<ConnectKitProvider>
				<Head>
					<title>Tailwind Some Works</title>
					<meta name="description" content="Tailwind Some Works" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Layout>{mounted && <Component {...pageProps} />}</Layout>
			</ConnectKitProvider>
		</WagmiConfig>
	);
}

export default MyApp;
