import React from "react";

const AboutPage = () => {
	return (
		<div name="about" className="w-full h-screen text-text pt-20">
			<div className="flex flex-col items-start w-full h-full pt-10 ">
				<div className="ml-20 pl-5 w-2/3">
					<div className="text-left pb-8">
						<p className="text-4xl font-bold inline border-b-4 border-secondary">
							Bundlr In The Browser
						</p>
						<span className="text-base mt-3 ml-5">
							<p className="text-2xl">
								Interactive code examples showing how to use Bundlr in the browser with
								React.
							</p>

							<p className="text-2xl mt-2">
								You can clone this repository{" "}
								<a
									className="underline decoration-primary"
									href="https://github.com/Bundlr-Network/webbundlr-basics"
									target="_blank"
								>
									{" "}
									from our GitHub.
								</a>{" "}
							</p>

							<ul className="list-disc mt-5">
								<li>
									<a className="underline decoration-primary" href="/normal-uploader">
										Normal Uploader:
									</a>{" "}
									Components to fund a node, check node balance and upload a file.
									Designed for smaller files that can be uploaded less than 1 min.
								</li>
								<li className="mt-5">
									<a className="underline decoration-primary" href="/large-file-uploader">
										Large File Uploader:
									</a>{" "}
									Components to fund a node, check node balance and upload a large file.
									This example includes code to create a progress bar showing upload
									progress that is updated using event callbacks.
								</li>
								<li className="mt-5">
									<a className="underline decoration-primary" href="/large-file-uploader">
										Lens Poster:
									</a>{" "}
									Components to fund a node, check node balance, upload a file, create
									metadata featuring that file, upload metadata to Bundlr, post metadata
									to Lens.
								</li>
								<li className="mt-5">
									<a className="underline decoration-primary" href="/livepeer">
										Lens Poster:
									</a>{" "}
									Components to transcode video stored on Arweave using Livepeer.
								</li>
							</ul>
						</span>
					</div>
				</div>

				<div className="pl-5 pr-5 w-full "></div>
			</div>
		</div>
	);
};
export default AboutPage;

///
