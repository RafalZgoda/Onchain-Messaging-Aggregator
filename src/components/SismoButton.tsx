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
        // Claims = prove groump membership of a Data Source in a specific Data Group.
        // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
        // When doing so Data Source is not shared to the app.
        claims={[
          {
            // claim on Sismo Hub GitHub Contributors Data Group membership: https://factory.sismo.io/groups-explorer?search=0xda1c3726426d5639f4c6352c2c976b87
            // Data Group members          = contributors to sismo-core/sismo-hub
            // value for each group member = number of contributions
            // request user to prove membership in the group
            groupId: "0x20c4ce0ee0687df3a3408c1659c3bafb", // impersonated github:dhadrien has 1 contribution, eligible
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
