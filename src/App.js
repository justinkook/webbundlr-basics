import "./index.css";
import ProgressBarPage from "./pages/ProgressBarPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
	[chain.polygonMumbai],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()],
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
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<ProgressBarPage />} />
						<Route path="/progress-bar" element={<ProgressBarPage />} />
					</Routes>
				</BrowserRouter>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;
