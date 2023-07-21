import "../../styles/globals.css";
import Head from "next/head";
import Layout from "components/Layout";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
	getDefaultConfig({
		appName: "Message aggregator",
		walletConnectProjectId: "73c9dc678dfec61c598e2cbffc35c82e",
		alchemyId: process.env.ALCHEMY_ID, // or infuraId

		// Optional
		appDescription: "Your App Description",
		appUrl: "https://family.co", // your app's url
		appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
	})
);

function MyApp({ Component, pageProps }) {
	return (
		<WagmiConfig config={config}>
			<ConnectKitProvider>
				<Head>
					<title>Tailwind Some Works</title>
					<meta name="description" content="Tailwind Some Works" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ConnectKitProvider>
		</WagmiConfig>
	);
}

export default MyApp;
