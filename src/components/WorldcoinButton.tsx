import { IDKitWidget } from "@worldcoin/idkit";

const onSuccess = async (response: any) => {
  console.log({ response });
};

const handleVerify = async (response: any) => {
  console.log({ response });
  await axios.post("/api/worldcoin-verify", response);
};

export default function WorldcoinButton({ signer: any }) {
  return (
    <>
      <div>
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WLD_APP_ID} // obtained from the Developer Portal
          action="vote_1" // this is your action name from the Developer Portal
          onSuccess={onSuccess} // callback when the modal is closed
          handleVerify={handleVerify} // optional callback when the proof is received
          credential_types={["orb", "phone"]} // optional, defaults to ['orb']
          enableTelemetry // optional, defaults to false
        >
          {({ open }) => <button onClick={open}>Verify with World ID</button>}
        </IDKitWidget>
        ;
      </div>
    </>
  );
}
