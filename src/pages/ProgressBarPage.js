import React from "react";
import ProgressBarUploader from "../components/ProgressBarUploader";
import FundNode from "../components/FundNode";
import NodeBalance from "../components/NodeBalance";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const ProgressBarPage = () => {
	return (
		<div name="about" className="w-full h-screen bg-background text-text">
			<div className="flex flex-col mt-20 items-start w-full h-full">
				<div className="pl-5 w-full">
					<div className="text-left pb-8">
						<p className="text-4xl font-bold inline border-b-4 border-primary">
							Progress Bar Uploader ...
						</p>
						<p className="text-base mt-3 ml-5">
							Demo of using the chunked uploader to upload a large file.
							<ol className="ml-1 list-decimal list-inside">
								<li>
									Head on over to the{" "}
									<a
										className="underline"
										href="https://mumbaifaucet.com/"
										target="_blank"
									>
										Mumbai Faucet.
									</a>
								</li>
								<li>Grab a full (free) Mumbai Matic.</li>
								<li>Fund a node.</li>
								<li>Upload a large file.</li>
							</ol>
						</p>
					</div>
				</div>

				<div className="pl-5 pr-5 w-full ">
					<div className="px-10 py-5" id="connect_container">
						<ConnectButton showBalance={true} />
					</div>
					<FundNode />
					<NodeBalance />
					<ProgressBarUploader />
				</div>
			</div>
		</div>
	);
};
export default ProgressBarPage;

///
