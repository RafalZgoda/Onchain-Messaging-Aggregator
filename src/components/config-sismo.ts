import { SismoConnectConfig } from "@sismo-core/sismo-connect-react";

export const config: SismoConnectConfig = {
	appId: "0x32403ced4b65f2079eda77c84e7d2be6",
	vault: {
		// For development purposes insert the Data Sources that you want to impersonate
		// Never use this in production
		impersonate: [
			// EVM Data Sources
			"dhadrien.sismo.eth",
			"leo21.sismo.eth",
			"0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
			"0xc281bd4db5bf94f02a8525dca954db3895685700",
			"vitalik.eth",
			// Github Data Source
			"github:dhadrien",
			// Twitter Data Source
			"twitter:dhadrien_",
			// Telegram Data Source
			"telegram:dhadrien",
		],
	},
	displayRawResponse: true, // this enables you to get access directly to the
	// Sismo Connect Response in the vault instead of redirecting back to the app
};
