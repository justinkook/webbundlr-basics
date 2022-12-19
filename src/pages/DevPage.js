import React from "react";
import NormalUploader from "../components/NormalUploader";
import FundNode from "../components/FundNode";
import NodeBalance from "../components/NodeBalance";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const DevPage = () => {
	return (
		<div name="about" className="w-full h-screen bg-background text-text pt-20">
			<div className="flex flex-col items-start w-full h-full pt-10">
				<div className="pl-5 w-full">
					<div className="text-left pb-8"></div>
				</div>

				<div className="pl-5 pr-5 w-full ">
					<div className="px-10 py-5" id="connect_container">
						<ConnectButton showBalance={true} />
					</div>
					<FundNode />
					<NodeBalance />
				</div>
			</div>
		</div>
	);
};
export default DevPage;
