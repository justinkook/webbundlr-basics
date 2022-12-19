import React from "react";
import NormalUploader from "../components/NormalUploader";
import FundNode from "../components/FundNode";
import NodeBalance from "../components/NodeBalance";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NormalUploaderPage = () => {
	return (
		<div name="about" className="w-full h-screen bg-background text-text pt-20">
			<div className="flex flex-col items-start w-full h-full pt-10">
				<div className="pl-5 w-full">
					<div className="text-left pb-8">
						<p className="text-4xl font-bold inline border-b-4 border-secondary">
							Normal Uploader ...
						</p>
						<p className="text-base mt-3 ml-5">
							Demo of uploading files from the browser using the WebBundlr class. Designed for
							smaller files, the uploder will block until complete.
							<br />
						</p>
						<ol className="ml-5 mt-5 list-decimal list-inside ">
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
						</ol>
					</div>
				</div>

				<div className="pl-5 pr-5 w-full ">
					<div className="px-10 py-5" id="connect_container">
						<ConnectButton showBalance={true} />
					</div>
					<FundNode />
					<NodeBalance />
					<NormalUploader />
				</div>
			</div>
		</div>
	);
};
export default NormalUploaderPage;
