const { generateImage, uploadFolderToIPFS, updateMetadata } = require('./utils');

const {
	INITIAL_SUPPLY,
	UPDATING_TOKEN_COUNT,
	IMAGE_UPDATE_DIR_PATH,
	METADATA_DIR_PATH,
	METADATA_UPDATE_DIR_PATH,
} = process.env;

const main = async () => {
	console.log(`Preparing random ${UPDATING_TOKEN_COUNT} images...`);
	let tokens = [];
	let count = UPDATING_TOKEN_COUNT;
	do {
		const tokenId = Math.floor(Math.random() * INITIAL_SUPPLY);
		if (!tokens.includes(tokenId)) {
			count--;
			tokens.push(tokenId);
		}
	} while (count >= 0);

	for (const token of tokens) {
		await generateImage(token, IMAGE_UPDATE_DIR_PATH);
	}

	console.log(`Uploading updated images to IPFS...`);
	await uploadFolderToIPFS(IMAGE_UPDATE_DIR_PATH);

	console.log(`Updating metadata...`);
	await updateMetadata(
		METADATA_DIR_PATH,
		METADATA_UPDATE_DIR_PATH,
		IMAGE_UPDATE_DIR_PATH
	);

	console.log(`Uploading updated metadata to IPFS...`);
	await uploadFolderToIPFS(METADATA_UPDATE_DIR_PATH);
};

main();
