import { EAS } from "@ethereum-attestation-service/eas-sdk";

export const checkAttestation = async (address: string,provider:any) => {
  const EASContractAddress = "0x223F2db258234F7Fa164a9e4C0929318FEb3B550";
  const eas = new EAS(address);
  eas.connect(provider);

  const uid =
    "0xff08bbf3d3e6e0992fc70ab9b9370416be59e87897c3d42b20549901d2cccc3e";

  const attestation = await eas.getAttestation(uid);

  console.log(attestation);
};

// checkAttestation("a");
