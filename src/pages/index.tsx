// react page

// import WorldcoinButton from "../components/WorldcoinButton";
// import SismoButton from "../components/SismoButton";

// export default function Home() {
//   return (
//     <>
//       <div>
//         <main>
//           <div className="flex items-center justify-center h-screen">
//             <WorldcoinButton signer={signer}></WorldcoinButton>
//             <SismoButton></SismoButton>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }
import { HeroText } from "@/components/Hero";
import type { NextPage } from "next";

const Home: NextPage = () => {
	return (
		<>
			<HeroText />
		</>
	);
};

export default Home;
