import Link from "next/link";

export const Logo = () => {
	return (
		<Link href="/">
			<h1 className="font-bold text-white text-5xl text-center hover:cursor-pointer">
				S<span className="text-[#3C8AFF]">3</span>ND
			</h1>
		</Link>
	);
};
