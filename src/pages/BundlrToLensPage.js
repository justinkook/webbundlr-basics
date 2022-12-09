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
						<div className="text-base mt-3 ml-5">
							Demo of using the chunked uploader to upload a large file.
							<ol className="ml-1 list-decimal list-inside">
								<li>
									Head on over to the{" "}
									<a
										className="underline decoration-primary"
										href="https://mumbaifaucet.com/"
										target="_blank"
									>
										Mumbai Faucet.
									</a>
								</li>
								<li>Grab a full (free) Mumbai Matic.</li>
								<li>Fund a node.</li>
								<li>Upload a file.</li>
								<li>Share To Lens.</li>
							</ol>
						</div>
					</div>
				</div>

				<div className="pl-5 pr-5 w-full ">
					<div className="px-10 py-5" id="connect_container">
						<ConnectButton showBalance={true} />
					</div>
					<FundNode />
					<NodeBalance />
					<NormalUploader />
					<LensUploader />
				</div>
			</div>
		</div>
	);
};
export default BundlrToLensPage;
