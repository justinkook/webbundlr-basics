import { ApolloClient, InMemoryCache, gql, createHttpLink } from "@apollo/client";
import { utils, ethers } from "ethers";
import { setContext } from "@apollo/client/link/context";
import omitDeep from "omit-deep";
import LENS_HUB_ABI from "./ABI.json";
import { createClient } from "urql";

export const LENS_HUB_CONTRACT = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
export const lensHub = new ethers.Contract(LENS_HUB_CONTRACT, LENS_HUB_ABI, getSigner());

const API_URL = "https://api.lens.dev";

/* configuring Apollo GraphQL Client */
const authLink = setContext((_, { headers }) => {
	const token = window.localStorage.getItem("lens-auth-token");
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const httpLink = createHttpLink({
	uri: API_URL,
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export const urqlClient = createClient({
	url: API_URL,
});
/* GraphQL queries and mutations */
export async function createPostTypedDataMutation(request, token) {
	const result = await client.mutate({
		mutation: createPostTypedData,
		variables: {
			request,
		},
		context: {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	});
	return result.data.createPostTypedData;
}

export const createPostTypedData = gql`
	mutation createPostTypedData($request: CreatePublicPostRequest!) {
		createPostTypedData(request: $request) {
			id
			expiresAt
			typedData {
				types {
					PostWithSig {
						name
						type
					}
				}
				domain {
					name
					chainId
					version
					verifyingContract
				}
				value {
					nonce
					deadline
					profileId
					contentURI
					collectModule
					collectModuleInitData
					referenceModule
					referenceModuleInitData
				}
			}
		}
	}
`;

export const challenge = gql`
	query Challenge($address: EthereumAddress!) {
		challenge(request: { address: $address }) {
			text
		}
	}
`;

export const authenticate = gql`
	mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
		authenticate(request: { address: $address, signature: $signature }) {
			accessToken
			refreshToken
		}
	}
`;

export const getDefaultProfile = gql`
	query DefaultProfile($address: EthereumAddress!) {
		defaultProfile(request: { ethereumAddress: $address }) {
			id
			handle
		}
	}
`;

export const validateMetadata = gql`
	query ValidatePublicationMetadata($metadatav2: PublicationMetadataV2Input!) {
		validatePublicationMetadata(request: { metadatav2: $metadatav2 }) {
			valid
			reason
		}
	}
`;

export const getPosts = gql`
	query Publications {
		publications(
			request: { profileId: "0xa4ed", publicationTypes: [POST, COMMENT, MIRROR], limit: 10 }
		) {
			items {
				__typename
				... on Post {
					...PostFields
				}
				... on Comment {
					...CommentFields
				}
				... on Mirror {
					...MirrorFields
				}
			}
			pageInfo {
				prev
				next
				totalCount
			}
		}
	}

	fragment MediaFields on Media {
		url
		mimeType
	}

	fragment ProfileFields on Profile {
		id
		name
		bio
		attributes {
			displayType
			traitType
			key
			value
		}
		isFollowedByMe
		isFollowing(who: null)
		followNftAddress
		metadata
		isDefault
		handle
		picture {
			... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			}
			... on MediaSet {
				original {
					...MediaFields
				}
			}
		}
		coverPicture {
			... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			}
			... on MediaSet {
				original {
					...MediaFields
				}
			}
		}
		ownedBy
		dispatcher {
			address
		}
		stats {
			totalFollowers
			totalFollowing
			totalPosts
			totalComments
			totalMirrors
			totalPublications
			totalCollects
		}
		followModule {
			...FollowModuleFields
		}
	}

	fragment PublicationStatsFields on PublicationStats {
		totalAmountOfMirrors
		totalAmountOfCollects
		totalAmountOfComments
		totalUpvotes
		totalDownvotes
	}

	fragment MetadataOutputFields on MetadataOutput {
		name
		description
		content
		media {
			original {
				...MediaFields
			}
		}
		attributes {
			displayType
			traitType
			value
		}
	}

	fragment Erc20Fields on Erc20 {
		name
		symbol
		decimals
		address
	}

	fragment PostFields on Post {
		id
		profile {
			...ProfileFields
		}
		stats {
			...PublicationStatsFields
		}
		metadata {
			...MetadataOutputFields
		}
		createdAt
		collectModule {
			...CollectModuleFields
		}
		referenceModule {
			...ReferenceModuleFields
		}
		appId
		hidden
		reaction(request: null)
		mirrors(by: null)
		hasCollectedByMe
	}

	fragment MirrorBaseFields on Mirror {
		id
		profile {
			...ProfileFields
		}
		stats {
			...PublicationStatsFields
		}
		metadata {
			...MetadataOutputFields
		}
		createdAt
		collectModule {
			...CollectModuleFields
		}
		referenceModule {
			...ReferenceModuleFields
		}
		appId
		hidden
		reaction(request: null)
		hasCollectedByMe
	}

	fragment MirrorFields on Mirror {
		...MirrorBaseFields
		mirrorOf {
			... on Post {
				...PostFields
			}
			... on Comment {
				...CommentFields
			}
		}
	}

	fragment CommentBaseFields on Comment {
		id
		profile {
			...ProfileFields
		}
		stats {
			...PublicationStatsFields
		}
		metadata {
			...MetadataOutputFields
		}
		createdAt
		collectModule {
			...CollectModuleFields
		}
		referenceModule {
			...ReferenceModuleFields
		}
		appId
		hidden
		reaction(request: null)
		mirrors(by: null)
		hasCollectedByMe
	}

	fragment CommentFields on Comment {
		...CommentBaseFields
		mainPost {
			... on Post {
				...PostFields
			}
			... on Mirror {
				...MirrorBaseFields
				mirrorOf {
					... on Post {
						...PostFields
					}
					... on Comment {
						...CommentMirrorOfFields
					}
				}
			}
		}
	}

	fragment CommentMirrorOfFields on Comment {
		...CommentBaseFields
		mainPost {
			... on Post {
				...PostFields
			}
			... on Mirror {
				...MirrorBaseFields
			}
		}
	}

	fragment FollowModuleFields on FollowModule {
		... on FeeFollowModuleSettings {
			type
			amount {
				asset {
					name
					symbol
					decimals
					address
				}
				value
			}
			recipient
		}
		... on ProfileFollowModuleSettings {
			type
			contractAddress
		}
		... on RevertFollowModuleSettings {
			type
			contractAddress
		}
		... on UnknownFollowModuleSettings {
			type
			contractAddress
			followModuleReturnData
		}
	}

	fragment CollectModuleFields on CollectModule {
		__typename
		... on FreeCollectModuleSettings {
			type
			followerOnly
			contractAddress
		}
		... on FeeCollectModuleSettings {
			type
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
		}
		... on LimitedFeeCollectModuleSettings {
			type
			collectLimit
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
		}
		... on LimitedTimedFeeCollectModuleSettings {
			type
			collectLimit
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
			endTimestamp
		}
		... on RevertCollectModuleSettings {
			type
		}
		... on TimedFeeCollectModuleSettings {
			type
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
			endTimestamp
		}
		... on UnknownCollectModuleSettings {
			type
			contractAddress
			collectModuleReturnData
		}
	}

	fragment ReferenceModuleFields on ReferenceModule {
		... on FollowOnlyReferenceModuleSettings {
			type
			contractAddress
		}
		... on UnknownReferenceModuleSettings {
			type
			contractAddress
			referenceModuleReturnData
		}
		... on DegreesOfSeparationReferenceModuleSettings {
			type
			contractAddress
			commentsRestricted
			mirrorsRestricted
			degreesOfSeparation
		}
	}
`;

export const recommendedProfiles = gql`
	query RecommendedProfiles {
		recommendedProfiles {
			id
			name
			bio
			attributes {
				displayType
				traitType
				key
				value
			}
			followNftAddress
			metadata
			isDefault
			picture {
				... on NftImage {
					contractAddress
					tokenId
					uri
					verified
				}
				... on MediaSet {
					original {
						url
						mimeType
					}
				}
				__typename
			}
			handle
			coverPicture {
				... on NftImage {
					contractAddress
					tokenId
					uri
					verified
				}
				... on MediaSet {
					original {
						url
						mimeType
					}
				}
				__typename
			}
			ownedBy
			dispatcher {
				address
				canUseRelay
			}
			stats {
				totalFollowers
				totalFollowing
				totalPosts
				totalComments
				totalMirrors
				totalPublications
				totalCollects
			}
			followModule {
				... on FeeFollowModuleSettings {
					type
					amount {
						asset {
							symbol
							name
							decimals
							address
						}
						value
					}
					recipient
				}
				... on ProfileFollowModuleSettings {
					type
				}
				... on RevertFollowModuleSettings {
					type
				}
			}
		}
	}
`;

/* helper functions */
function getSigner() {
	if (typeof window !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		return signer;
	}
	return null;
}

export const signedTypeData = (domain, types, value) => {
	const signer = getSigner();
	return signer._signTypedData(
		omit(domain, "__typename"),
		omit(types, "__typename"),
		omit(value, "__typename"),
	);
};

export function omit(object, name) {
	return omitDeep(object, name);
}

export const splitSignature = (signature) => {
	return utils.splitSignature(signature);
};

export const signCreatePostTypedData = async (request, token) => {
	const result = await createPostTypedDataMutation(request, token);
	const typedData = result.typedData;
	const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
	return { result, signature };
};
