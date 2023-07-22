import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
	return (
		<Link href="/">
			<h1 className="font-bold text-white text-5xl text-center hover:cursor-pointer">
				<Image
					alt="S3ND"
					src="img/logo.png"
					className="object-contain w-52 mt-[-25px]"
				/>
			</h1>
		</Link>
	);
};
