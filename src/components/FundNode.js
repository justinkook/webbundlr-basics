import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { useProvider, useSigner } from "wagmi";
import { WebBundlr } from "@bundlr-network/client";

const FundNode = () => {
	const [fundAmount, setFundAmount] = useState(1);
	const [fundMessage, setFundMessage] = useState("");
	const rainbowKitProvider = useProvider();
	const { data: rainbowKitSigner, isError, isLoading } = useSigner();

	const fundNode = async () => {
		if (!rainbowKitSigner) {
			setFundMessage("Please connect your wallet first.");
			return;
		}
		// use method injection to add the missing function
		rainbowKitProvider.getSigner = () => rainbowKitSigner;
		// create a WebBundlr object
		const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", rainbowKitProvider, {
			providerUrl: "https://rpc-mumbai.matic.today",
		});

		await bundlr.ready();

		const fundAmountParsed = new BigNumber(fundAmount).multipliedBy(bundlr.currencyConfig.base[1]);

		await bundlr
			.fund(fundAmountParsed.toString())
			.then((res) => {
				setFundMessage("Wallet Funded");
			})
			.catch((e) => {
				console.log(e);
				setFundMessage("Error While Funding ", e.message);
			});
	};

	return (
		<div className="px-10 py-5 flex flex-col" id="fund_container">
			<label className="pr-5block mb-2 text-sm font-medium text-text" for="file_input">
				Fund Node
			</label>
			<div className="flex flex-row">
				<input
					className="rounded w-1/3 pl-3 focus:outline-none text-black"
					type="number"
					value={fundAmount}
					onChange={(e) => setFundAmount(e.target.value)}
				/>
				<button
					class="ml-5 bg-primary text-background font-bold py-1 px-3 rounded-lg"
					onClick={fundNode}
				>
					Fund
				</button>
			</div>
			<p className="text-messageText text-sm">{fundMessage}</p>
		</div>
	);
};
export default FundNode;
