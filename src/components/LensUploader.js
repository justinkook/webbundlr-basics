import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
	client,
	urqlClient,
	challenge,
	authenticate,
	getDefaultProfile,
	signCreatePostTypedData,
	lensHub,
	splitSignature,
	validateMetadata,
	getPosts,
	recommendedProfiles,
} from "../lens/api";
import { v4 as uuid } from "uuid";
import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";
import { useProvider, useSigner } from "wagmi";

const LensUploader = (props) => {
	const [message, setMessage] = useState("");
	const [address, setAddress] = useState();
	const [session, setSession] = useState(null);
	const [profileId, setProfileId] = useState("");
	const [handle, setHandle] = useState("");
	const [token, setToken] = useState("");
	const [metadata, setMetadata] = useState("");
	const [contentURI, setContentURI] = useState("");

	const rainbowKitProvider = useProvider();
	const { data: rainbowKitSigner, isError, isLoading } = useSigner();

	useEffect(() => {
		checkConnection();
	}, []);

	useEffect(() => {
		if (!handle) setMetadata("Please login first.");
		// metadata structure for embedded url posts
		// setMetadata(
		// 	`{
		// 		"version": "2.0.0",
		// 		"metadata_id": "${uuid()}",
		// 		"description": "gm (🌿, 🌿)",
		// 		"content": "The Design Is Sublime",
		// 		"animation_url": "https://arweave.net/i4iQhgpzcYaC53OyaRBZtlBzgwGJjTdqtFOPFN6HAVI",
		// 		"external_url": "https://arweave.net/i4iQhgpzcYaC53OyaRBZtlBzgwGJjTdqtFOPFN6HAVI",
		// 		"image": null,
		// 		"imageMimeType": null,
		// 		"name": "Post by ${handle}",
		// 		"attributes": [{ "traitType": "type", "value": "POST" }],
		// 		"media": [],
		// 		"appId": "Blockmix",
		// 		"locale": "en",
		// 		"mainContentFocus": "EMBED"
		// 	}`,
		// );
		// metadata structure for image posts
		setMetadata(
			`{
				"version": "2.0.0",
				"metadata_id": "${uuid()}",
				"description": "gm (🌿, 🌿)",
				"image": "https://arweave.net/CO9EpX0lekJEfXUOeXncUmMuG8eEp5WJHXl9U9yZUYA",
				"imageMimeType": "image/png",
				"name": "Post by ${handle}",
				"attributes": [{ "traitType": "type", "value": "POST" }],
				"media": [
					{
					  "item": "https://arweave.net/CO9EpX0lekJEfXUOeXncUmMuG8eEp5WJHXl9U9yZUYA",
					  "type": "image/png",
					  "altTag": ""
					}
				  ],
				"appId": "ImageUploader",
				"locale": "en",
				"mainContentFocus": "IMAGE"
			}`,
		);
	}, [handle]);
	//https://arweave.net/CO9EpX0lekJEfXUOeXncUmMuG8eEp5WJHXl9U9yZUYA
	const checkConnection = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const accounts = await provider.listAccounts();
		if (accounts.length) {
			setAddress(accounts[0]);
			const response = await client.query({
				query: getDefaultProfile,
				variables: { address: accounts[0] },
			});
			setProfileId(response.data.defaultProfile.id);
			setHandle(response.data.defaultProfile.handle);
		}
	};

	const login = async () => {
		console.log("Logging in: address=" + address);
		try {
			const challengeInfo = await client.query({
				query: challenge,
				variables: {
					address,
				},
			});
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const signature = await signer.signMessage(challengeInfo.data.challenge.text);
			const authData = await client.mutate({
				mutation: authenticate,
				variables: {
					address,
					signature,
				},
			});

			const {
				data: {
					authenticate: { accessToken },
				},
			} = authData;
			localStorage.setItem("lens-auth-token", accessToken);
			setToken(accessToken);
			setSession(authData.data.authenticate);
			setMessage("Successful login ");
			console.log(accessToken);
		} catch (err) {
			console.log("Error signing in: ", err);
			setMessage("Error signing in: " + err);
		}
	};

	const doValidateMetadata = async () => {
		try {
			const result = await client.query({
				query: validateMetadata,
				variables: {
					metadatav2: JSON.parse(metadata),
				},
			});
			console.log(
				"Metadata validation: " +
					result.data.validatePublicationMetadata.valid +
					" " +
					result.data.validatePublicationMetadata.reason,
			);
			setMessage("Metadata validation: " + result.data.validatePublicationMetadata.valid);
		} catch (e) {
			setMessage("Error validating metadata " + e);
			console.log(e);
		}
	};

	const doSaveMetadataToBundlr = async () => {
		if (!rainbowKitSigner) {
			setMessage("Please connect your wallet first.");
			return;
		}

		// use method injection to add the missing function
		rainbowKitProvider.getSigner = () => rainbowKitSigner;
		// create a WebBundlr object
		const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", rainbowKitProvider, {
			providerUrl: "https://matic-mumbai.chainstacklabs.com",
		});
		//const bundlr = new WebBundlr("https://node2.bundlr.network", "matic", rainbowKitProvider);

		await bundlr.ready();
		const data = JSON.stringify(JSON.parse(metadata));
		const tx = await bundlr.upload(data, {
			tags: [{ name: "Content-Type", value: "application/json" }],
		});

		console.log(`Upload success content URI= https://arweave.net/${tx.id}`);
		setMessage(`Upload success content URI= https://arweave.net/${tx.id}`);
		setContentURI("https://arweave.net/" + tx.id);
	};

	const doPostToLens = async () => {
		console.log("create post called");
		const createPostRequest = {
			profileId,
			contentURI: contentURI,
			collectModule: {
				freeCollectModule: { followerOnly: true },
			},
			referenceModule: {
				followerOnlyReferenceModule: false,
			},
		};
		console.log("createPostRequest=", createPostRequest);
		try {
			const signedResult = await signCreatePostTypedData(createPostRequest, token);
			const typedData = signedResult.result.typedData;
			const { v, r, s } = splitSignature(signedResult.signature);

			let pubCount = await lensHub.getPubCount(typedData.value.profileId);
			console.log(`Before posting pubCount=${pubCount}`);
			const tx = await lensHub.postWithSig({
				profileId: typedData.value.profileId,
				contentURI: typedData.value.contentURI,
				collectModule: typedData.value.collectModule,
				collectModuleInitData: typedData.value.collectModuleInitData,
				referenceModule: typedData.value.referenceModule,
				referenceModuleInitData: typedData.value.referenceModuleInitData,
				sig: {
					v,
					r,
					s,
					deadline: typedData.value.deadline,
				},
			});
			console.log("tx successful; ", tx);
			console.log("successfully created post: tx hash", tx.hash);
			pubCount = await lensHub.getPubCount(typedData.value.profileId);
			console.log(`After posting pubCount=${pubCount}`);
			console.log("Latest Post=" + (await lensHub.getPub(typedData.value.profileId, pubCount)));
		} catch (err) {
			console.log("error posting publication: ", err);
		}
	};

	const getPostsForThisApp = async () => {
		try {
			console.log("getPosts");
			const response = await urqlClient.query(getPosts).toPromise();
			console.log("got posts=" + response.data);
			console.log("getPostsForThisApp=", response.data.publications);
			setMessage("Post Count: " + response.data.publications.items.length);
		} catch (e) {
			setMessage("Error validating metadata " + e);
			console.log(e);
		}
	};

	return (
		<div className="px-10 py-5 flex flex-col" id="balance_container">
			<label className="pr-5 block mb-2 font-bold text-text underline decoration-secondary">
				Post To Lens
			</label>
			<p className="w-2/3">
				<a href="https://www.lens.xyz/" className="underline decoration-primary">
					Lens Protocol
				</a>{" "}
				is a composable and decentralized social graph. It makes developing social application
				extremely quick and easy. This demo breaks down all the steps required when posting to lens.
				Your own apps will likely create a better UI experience by combining many of the steps
				below, we broke them apart to help you understand each step of the process.
			</p>
			<p className="w-2/3 mt-5">
				This demonstrates how to upload post metadata for an image style post.
			</p>

			<ol className="list-disc ml-5 mt-5 w-2/3">
				<li>
					Click "Login" to login to Lens Protocol and create an authentation token that will be
					used when posting.{" "}
					<span className="font-bold">
						The wallet address you use to login must have a Lens account.
					</span>
				</li>
				<li>Click "Validate Metadata" to ensure your metadata is correct.</li>
				<li>
					Click "Save Metadata To Bundlr" to upload your metadata to Arweave via Bundlr. The URL
					to the metadata will be show for reference, you don't need to save it.
				</li>
				<li>
					Click "Post To Lens" to create a new post to Lens Protocol, your metadata URL will be
					supplied to Lens as the content URI.
				</li>
			</ol>
			<div className="flex flex-row">
				<div className="w-full pl-3 focus:outline-none text-black">
					<textarea
						className="
								form-control
								block
								w-full
								px-3
								py-1.5
								text-text text-sm
								text-gray-700
								bg-white bg-clip-padding
								border border-solid border-gray-300
								rounded
								transition
								ease-in-out
								m-0 text-sm"
						id="metadata"
						rows="16"
						value={metadata}
						onChange={(e) => setMetadata(e.target.value)}
					></textarea>
				</div>
			</div>
			<p className="text-messageText text-sm">{message}</p>
			<div className="flex flex-row justify-end mt-5">
				<button
					className="mb-5 bg-primary text-background font-bold py-1 px-3 rounded-lg"
					onClick={login}
				>
					1.Login
				</button>
				<button
					className="ml-5 mb-5 bg-primary text-background font-bold py-1 px-3 rounded-lg"
					onClick={doValidateMetadata}
				>
					2.Validate Metadata
				</button>
				<button
					className="ml-5 mb-5 bg-primary text-background font-bold py-1 px-3 rounded-lg"
					onClick={doSaveMetadataToBundlr}
				>
					3.Save Metadata To Bundlr
				</button>
				<button
					className="ml-5 mb-5 bg-primary text-background font-bold py-1 px-3 rounded-lg"
					onClick={doPostToLens}
				>
					4.Post To Lens
				</button>
				<button
					className="ml-5 mb-5 bg-primary text-background font-bold py-1 px-3 rounded-lg"
					onClick={getPostsForThisApp}
				>
					5.Get Posts
				</button>
			</div>
		</div>
	);
};

export default LensUploader;
