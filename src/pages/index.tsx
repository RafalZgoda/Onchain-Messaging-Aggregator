import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
		return (
		<>
			<div>
				<main>
					<div className="flex items-center justify-center h-screen">
						<ConnectKitButton />
					</div>
				</main>
			</div>
		</>
	);
}
