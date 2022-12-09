import React, { useState, useRef } from "react";
import { useProvider, useSigner } from "wagmi";
import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";

const NormalUploader = () => {
	const [message, setMessage] = useState("");
	const [uploadedURL, setUploadedURL] = useState("");
	const [fileToUpload, setFileToUpload] = useState();
	const [fileType, setFileType] = useState();
	const totalChunks = useRef(0);

	const rainbowKitProvider = useProvider();
	const { data: rainbowKitSigner, isError, isLoading } = useSigner();

	const handleFile = async (e) => {
		setMessage("");
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const upload = async () => {
		if (!rainbowKitSigner) {
			setMessage("Please connect your wallet first.");
			return;
		}
		if (!fileToUpload) {
			setMessage("Please select a file first.");
			return;
		}
		// use method injection to add the missing function
		rainbowKitProvider.getSigner = () => rainbowKitSigner;
		// create a WebBundlr object
		const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", rainbowKitProvider, {
			providerUrl: "https://matic-mumbai.chainstacklabs.com",
		});

		await bundlr.ready();

		try {
			const dataStream = fileReaderStream(fileToUpload);
			const tx = await bundlr.upload(dataStream, {
				tags: [{ name: "Content-Type", value: fileType }],
			});
			console.log(tx);
			console.log(`File uploaded ==> https://arweave.net/${tx.id}`);
			setMessage(`Upload Success:`);
			setUploadedURL("https://arweave.net/" + tx.id);
		} catch (e) {
			setMessage("Upload error " + e.message);
			console.log("error on upload, ", e);
		}
	};

	return (
		<div className="flex flex-col py-5 ml-10">
			<label className="pr-5 block mb-2 font-bold text-text underline decoration-secondary">
				Upload file
			</label>
			<div className="flex flex-row">
				<input
					type="file"
					onChange={handleFile}
					className="w-1/3 px-1 py-1 block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					multiple="single"
					name="files[]"
				/>
				<button
					className="ml-5 bg-primary hover:bg-blue-700 text-background font-bold py-1 px-3 rounded-lg"
					onClick={upload}
				>
					Upload
				</button>
			</div>

			<p className="text-messageText text-sm">{message}</p>
			<p className="text-text text-sm">
				{uploadedURL && (
					<a className="underline" href={uploadedURL} target="_blank">
						{uploadedURL}
					</a>
				)}
			</p>
		</div>
	);
};

export default NormalUploader;
