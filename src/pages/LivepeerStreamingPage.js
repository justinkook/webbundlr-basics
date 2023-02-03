import React from "react";
import DecentralizedStoragePlayback from "../components/DecentralizedStoragePlayback";
import { LivepeerConfig, createReactClient, studioProvider } from "@livepeer/react";

const LivepeerStreamingPage = () => {
	const livepeerClient = createReactClient({
		provider: studioProvider({
			apiKey: "af1714a8-9d87-41d9-aa20-d62e4a0aaa43",
		}),
	});
	return (
		<div name="about" className="w-full h-screen bg-background text-text pt-20">
			<div className="flex flex-col items-start w-full h-full pt-10">
				<div className="pl-5 w-full">
					<div className="text-left pb-8">
						<p className="text-4xl font-bold inline border-b-4 border-secondary">
							Livepeer transcoding ...
						</p>
						<p className="text-base mt-3 ml-5">
							Demo of using Livepeer to transcode video files stored on Arweave. <br />
							Read more about how to do it in{" "}
							<a
								className="underline decoration-primary"
								href="https://docs.bundlr.network/recipes/livepeer"
							>
								this recipe.
							</a>{" "}
						</p>
					</div>
				</div>

				<div className="pl-5 pr-5 w-full ">
					<LivepeerConfig client={livepeerClient}>
						<DecentralizedStoragePlayback />
					</LivepeerConfig>
				</div>
			</div>
		</div>
	);
};
export default LivepeerStreamingPage;
