import React, { useState, useEffect } from "react";
import { useProvider, useSigner } from "wagmi";
import { WebBundlr } from "@bundlr-network/client";

const NodeBalance = () => {
	const [nodeBalance, setNodeBalance] = useState(0);
	const [balanceMessage, setBalanceMessage] = useState("");
	const rainbowKitProvider = useProvider();
	const { data: rainbowKitSigner, isError, isLoading } = useSigner();

	const updateNodeBalance = async () => {
		if (!rainbowKitSigner) {
			setBalanceMessage("Please connect your wallet first.");
			return;
		}
		// use method injection to add the missing function
		rainbowKitProvider.getSigner = () => rainbowKitSigner;
		const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", rainbowKitProvider, {
			providerUrl: "https://matic-mumbai.chainstacklabs.com",
		});

		const curBalance = await bundlr.getBalance(rainbowKitSigner._address);
		setNodeBalance(bundlr.utils.unitConverter(curBalance).toFixed(7, 2).toString());
		setBalanceMessage("Node balance updated.");
	};

	useEffect(() => {
		updateNodeBalance();
	}, [rainbowKitSigner]);

	return (
		<div className="px-10 py-5 flex flex-col" id="balance_container">
			<label className="pr-5 block mb-2 font-bold text-text underline decoration-secondary">
				Node Balance
			</label>
			<div className="flex flex-row">
				<input
					className="rounded w-1/3 pl-3 focus:outline-none text-black"
					type="number"
					readOnly
					value={nodeBalance}
				/>
				<button
					className="ml-5 bg-primary text-background font-bold py-1 px-3 rounded-lg"
					onClick={updateNodeBalance}
				>
					Refresh
				</button>
			</div>
			<p className="text-messageText text-sm">{balanceMessage}</p>
		</div>
	);
};
export default NodeBalance;

///
