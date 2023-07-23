/* eslint-disable react/jsx-key */
import { init, useQuery } from "@airstack/airstack-react";
import EnsNameAvatar from "./ENSNameAvatar";
import { useAccount } from "wagmi";

init(process.env.NEXT_PUBLIC_AIRSTACK_KEY);

const query = `query POAPsByAddress {
    Poaps(input: {filter: {owner: {_eq: "vitalik.eth"}}, blockchain: ALL}) {
      Poap {
        id
        chainId
        blockchain
        dappName
        dappSlug
        dappVersion
        eventId
        createdAtBlockTimestamp
        createdAtBlockNumber
        tokenId
        tokenAddress
        tokenUri
        poapEvent {
          id
          chainId
          blockchain
          dappName
          dappSlug
          dappVersion
          eventId
          eventName
          country
          city
          startDate
          endDate
          isVirtualEvent
          eventURL
          poaps {
            owner {
              addresses
            }
          }
        }
      }
    }
  }`;
export default function RecommendedList() {
  let { address } = useAccount();
  address = "vitalik.eth" as `0x${string}`;
  const query = `query POAPsByAddress {
        Poaps(input: {filter: {owner: {_eq: "${address}"}}, blockchain: ALL}) {
          Poap {
            id
            chainId
            blockchain
            dappName
            dappSlug
            dappVersion
            eventId
            createdAtBlockTimestamp
            createdAtBlockNumber
            tokenId
            tokenAddress
            tokenUri
            poapEvent {
              id
              chainId
              blockchain
              dappName
              dappSlug
              dappVersion
              eventId
              eventName
              country
              city
              startDate
              endDate
              isVirtualEvent
              eventURL
              poaps {
                owner {
                  addresses
                }
              }
            }
          }
        }
      }`;
  const { data, loading, error } = useQuery(query, {}, { cache: false });

  const poaps = data?.Poaps?.Poap?.slice(0, 2);

  if (!poaps) return <></>;

  return (
    <div>
      <h3 className="font-normal text-lg mb-0">Recommended</h3>
      {poaps.map((poap) => (
        <div className="hover:cursor-pointer hover:bg-black p-4 rounded-md">
          <EnsNameAvatar
            address={poap.poapEvent?.poaps[0].owner.addresses[0]}
            subText={`Also attended ${poap.poapEvent.eventName}`}
          />
        </div>
      ))}
    </div>
  );
}
