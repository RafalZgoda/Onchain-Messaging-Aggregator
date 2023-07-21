import { ethers } from "ethers";

export const connectWallet = async function () {
  // Check if the ethereum object exists on the window object
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request access to the user's Ethereum accounts
      await window.ethereum.enable();

      // Instantiate a new ethers provider with Metamask
      console.log(ethers);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer from the ethers provider
      setSigner(provider.getSigner());

      // Update the isConnected data property based on whether we have a signer
      setIsConnected(true);
    } catch (error) {
      console.error("User rejected request", error);
    }
  } else {
    console.error("Metamask not found");
  }
};
