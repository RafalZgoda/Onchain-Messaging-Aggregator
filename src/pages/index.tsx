import { HeroText } from "@/components/Hero";
import { Button } from "@mantine/core";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
	return (
		<>
			<HeroText />
		</>
	);
}
