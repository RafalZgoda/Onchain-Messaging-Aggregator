import WorldcoinButton from "@/components/WorldcoinButton";
import { isVerified } from "@/libs/supabase";
import { Loader } from "@mantine/core";
import { TUserProfile } from "@/libs";
import Image from "next/image";
import { useEffect, useState } from "react";
import SismoButton from "@/components/SismoButton";

export const Profile = ({
	profile,
	signer,
}: {
	profile: TUserProfile;
	signer;
}) => {
	const [verified, setVerified] = useState(false);

	const checkVerified = async () => {
		const v = await isVerified(signer._address);
		setVerified(v);
	};

	useEffect(() => {
		if (!signer) return;
		checkVerified();
	}, [signer]);
	return (
		<div className="p-10">
			{!profile && <Loader className="block mt-20 mx-auto" />}
			{profile && (
				<div className="flex justify-between gap-10 items-center">
					<div className="w-6/12 bg-[#38383fb7]  px-10 py-5 flex rounded-[50px] items-center h-32">
						<img
							src="img/eth.png"
							className="w-16 mr-3 object-contain"
						></img>
						<div>
							<h1 className="m-0 p-0">
								{profile?.ENS}
								{profile?.ENS && (
									<svg
										onClick={() =>
											window.open(
												"https://web3.bio/" +
													profile.ENS
											)
										}
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="ml-5 w-6 h-6 cursor-pointer"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
										/>
									</svg>
								)}
							</h1>
							<p className="m-0 p-0 flex items-center">
								{verified && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-6 h-6 mr-1 text-[#3C8AFF]"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
										/>
									</svg>
								)}
								{profile?.identity}
							</p>
						</div>
					</div>
					<div className="w-6/12 bg-white py-5 flex rounded-[20px] items-center">
						<img
							src="img/worldcoin.png"
							className="mx-auto w-72 h-10 object-cover"
						/>
						<div className="flex items-end flex-col px-5">
							<h1 className="text-black text-right text-sm p-0 mb-3">
								Prove your uniqueness and humaness. <br></br>
								Verify your account using World ID
							</h1>
							{verified ? (
								<button
									disabled={true}
									className="cursor-pointer border-none px-5 py-2 rounded-md w-fit mx-auto bg-black hover:opacity-90 hover:bg-black transition"
								>
									You are verified 🎉
								</button>
							) : (
								<WorldcoinButton
									signer={signer}
								></WorldcoinButton>
							)}
						</div>
					</div>
					<SismoButton />
				</div>
			)}
			{profile?.neighbors.map((neighbor, index) => {
				return (
					<div
						key={index}
						className="mb-3 bg-[#38383fb7] w-6/12 px-10 py-5 flex rounded-[50px]"
					>
						<Image
							src={"/img/" + neighbor.source + ".png"}
							className="w-16 mr-3 object-contain"
							width={64}
							height={64}
							alt={neighbor.source}
						/>
						<div>
							<h1 className="m-0 p-0">{neighbor.displayName}</h1>
							<p className="m-0 p-0">{neighbor.identity}</p>
							<p className="m-0 p-0">{neighbor.source}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};
