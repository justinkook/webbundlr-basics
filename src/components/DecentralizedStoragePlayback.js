import { Player } from "@livepeer/react";

const DecentralizedStoragePlayback = () => {
	return (
		<div>
			<Player
				title="Bundlr SDK For NodeJs"
				src="https://arweave.net/aqvPK_xi-EDcmAHPAPpDcaYyGekp-06T16ElvNTnJNk"
				autoPlay
				muted
				autoUrlUpload={{ fallback: true }}
			/>
		</div>
	);
};

export default DecentralizedStoragePlayback;
