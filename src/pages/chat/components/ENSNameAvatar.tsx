import { useEnsAvatar, useEnsName } from "wagmi";

export default function EnsNameAvatar({
	address,
	subtext,
}: {
	address: `0x${string}`;
	subtext: string;
}) {
	const {
		data: ensName,
		isError,
		isLoading: isEnsNameLoading,
	} = useEnsName({
		address: address,
	});

	const { data: ensAvartUrl } = useEnsAvatar({
		name: ensName,
		chainId: 1,
	});

	return (
		<div>
			<img
				className="rounded-full w-10 h-10 mr-3"
				src={ensAvartUrl ?? "/img/eth.png"}
			></img>
			<h2 className="font-medium text-white text-sm m-0">{ensName}</h2>
			<p className=" text-telegram-gray-100 text-xs m-0">{subtext}</p>
		</div>
	);
}
