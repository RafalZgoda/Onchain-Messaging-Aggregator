import {
  SismoConnectButton,
  SismoConnectConfig,
  AuthType,
  ClaimType,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-react";
import { config } from "./config-sismo";

export default function SismoButton() {
  return (
    <>
      <SismoConnectButton
        config={config}
        // Auths = Data Source Ownership Requests
        auths={[
          // Anonymous identifier of the vault for this app
          // vaultId = hash(vaultSecret, appId).
          // full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
          // user is required to prove ownership of their vaultId for this appId
          { authType: AuthType.VAULT },
          // user is required to prove ownership of an EVM account from their vault
          { authType: AuthType.EVM_ACCOUNT },
          // user is required to prove ownership of 0xa4c94a6091545e40fc9c3e0982aec8942e282f38
          {
            authType: AuthType.EVM_ACCOUNT,
            userId: "0xa4c94a6091545e40fc9c3e0982aec8942e282f38", // impersonated
          },
          // user is required to prove ownership of a GitHub account
          { authType: AuthType.GITHUB },
          // user can prove ownership of a Twitter account, optional
          { authType: AuthType.TWITTER, isOptional: true },
          // user can prove ownership of @dhadrien Telegram account, optional
          //                                   telegram of @dhadrien
          {
            authType: AuthType.TELEGRAM,
            userId: "875608110",
            isOptional: true,
          },
        ]}
        // Claims = prove groump membership of a Data Source in a specific Data Group.
        // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
        // When doing so Data Source is not shared to the app.
        claims={[
          {
            // claim on Sismo Hub GitHub Contributors Data Group membership: https://factory.sismo.io/groups-explorer?search=0xda1c3726426d5639f4c6352c2c976b87
            // Data Group members          = contributors to sismo-core/sismo-hub
            // value for each group member = number of contributions
            // request user to prove membership in the group
            groupId: "0xda1c3726426d5639f4c6352c2c976b87", // impersonated github:dhadrien has 1 contribution, eligible
          },
          {
            // claim ENS DAO Voters Data Group membership: https://factory.sismo.io/groups-explorer?search=0x85c7ee90829de70d0d51f52336ea4722
            // Data Group members          = voters in ENS DAO
            // value for each group member = number of votes in ENS DAO
            // request user to prove membership in the group with value >= 17
            groupId: "0x85c7ee90829de70d0d51f52336ea4722",
            claimType: ClaimType.GTE,
            value: 4, // impersonated dhadrien.sismo.eth has 17 votes, eligible
          },
          {
            // claim on Stand with Crypto NFT Minters Data Group membership: https://factory.sismo.io/groups-explorer?search=0xfae674b6cba3ff2f8ce2114defb200b1
            // Data Group members          = minters of the Stand with Crypto NFT
            // value for each group member = number of NFT minted
            // request user to prove membership in the group with value = 10
            groupId: "0xfae674b6cba3ff2f8ce2114defb200b1",
            claimType: ClaimType.EQ,
            value: 10, // dhadrin.sismo.eth minted exactly 10, eligible
          },
          {
            // claim Gitcoin Passport Holders Data Group membership: https://factory.sismo.io/groups-explorer?search=0x1cde61966decb8600dfd0749bd371f12
            // Data Group members          = Gitcoin Passport Holders
            // value for each group member = Gitcoin Passport Score
            // request user to prove membership in the group with value > 15, user can reveal more if they want
            groupId: "0x1cde61966decb8600dfd0749bd371f12",
            claimType: ClaimType.GTE,
            value: 15, // dhadrien.sismo.eth has a score of 46, eligible. Can reveal more.
            isSelectableByUser: true, // can reveal more than 15 if they want
          },
          {
            // claim on Stand with Crypto NFT Minters Data Group membership: https://factory.sismo.io/groups-explorer?search=0xfae674b6cba3ff2f8ce2114defb200b1
            // optional request user to prove membership in the group with value >= 6
            groupId: "0xfae674b6cba3ff2f8ce2114defb200b1",
            claimType: ClaimType.GTE,
            value: 6, // dhadrien.sismo.eth minted 10 NFTs, eligible
            isOptional: true,
          },
          {
            // claim on Gitcoin Passport Holders Data Group membership: https://factory.sismo.io/groups-explorer?search=0x1cde61966decb8600dfd0749bd371f12
            // optional request user to prove membership in the group with value = 15
            groupId: "0x1cde61966decb8600dfd0749bd371f12",
            claimType: ClaimType.EQ,
            value: 15, // dhadrien.sismo.eth has a score of 46 != 15, not eligible.
            isOptional: true, // can chose not to reveal
          },
          {
            // claim on Sismo Hub GitHub Contributors Data Group membership: https://factory.sismo.io/groups-explorer?search=0xda1c3726426d5639f4c6352c2c976b87
            // optional request user to prove membership in the group and reveal any value they want
            groupId: "0xda1c3726426d5639f4c6352c2c976b87",
            claimType: ClaimType.GTE,
            value: 1,
            isSelectableByUser: true, // can selectively disclose more if user wants
            isOptional: true, // can chose not to reveal
          },
        ]}
        // we ask the user to sign a message
        signature={{ message: "I love Sismo!", isSelectableByUser: true }}
        // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
        onResponse={async (response: SismoConnectResponse) => {
          // await fetch("/api/verify", {
          //   method: "POST",
          //   body: JSON.stringify(response),
          // });
          console.log({ response });
          const sismoResponse = await fetch("/api/sismo-verify", {
            method: "POST",
            body: JSON.stringify(response),
          });
          console.log({ sismoResponse });
        }}
      />
    </>
  );
}
