import "./index.css";
import Navbar from "./components/Navbar";
import NormalUploaderPage from "./pages/NormalUploaderPage";
import LargeFileUploader from "./pages/LargeFileUploader";
import BundlrToLensPage from "./pages/BundlrToLensPage";
import AboutPage from "./pages/AboutPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import FallingBlocks from "./canvas/FallingBlocks";

const { chains, provider } = configureChains(
	[chain.polygonMumbai],
	// [chain.polygon],
	[publicProvider()],
);

const { connectors } = getDefaultWallets({
	appName: "Bundlr Tools",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

function App() {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={darkTheme({
					accentColor: "var(--primary)",
					accentColorForeground: "var(--background)",
					borderRadius: "small",
					fontStack: "system",
					overlayBlur: "small",
				})}
			>
				<div name="top" className="w-full h-full min-h-screen top-0 bg-background">
					<FallingBlocks
						className="fixed"
						height={window.innerHeight}
						width={window.innerWidth}
					/>

					<div className="absolute w-full z-1 top-0">
						<Navbar className="z-3" />
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<AboutPage />} />
								<Route path="/normal-uploader" element={<NormalUploaderPage />} />
								<Route path="/large-file-uploader" element={<LargeFileUploader />} />
								<Route path="/lens-poster" element={<BundlrToLensPage />} />
								<Route path="/about" element={<AboutPage />} />
							</Routes>
						</BrowserRouter>
					</div>
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;
