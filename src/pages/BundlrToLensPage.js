import React from "react";
import NormalUploader from "../components/NormalUploader";
import FundNode from "../components/FundNode";
import NodeBalance from "../components/NodeBalance";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import LensUploader from "../components/LensUploader";

const BundlrToLensPage = () => {
	return (
		<div name="about" className="w-full h-screen bg-background text-text pt-20">
			<div className="flex flex-col items-start w-full h-full pt-10">
				<div className="pl-5 w-full">
					<div className="text-left pb-8">
						<p className="text-4xl font-bold inline border-b-4 border-secondary">
							Bundlr To Lens ...
						</p>
					</div>
				</div>

				<div className="pl-5 pr-5 w-full ">
					<div className="px-10 py-5 z-0" id="connect_container">
						<ConnectButton showBalance={true} />
					</div>

					<LensUploader />
				</div>
			</div>
		</div>
	);
};
export default BundlrToLensPage;
