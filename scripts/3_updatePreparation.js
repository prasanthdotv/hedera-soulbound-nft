// Import necessary functions from the utils module
const { generateImage, uploadFolderToIPFS, updateMetadata } = require('./utils');

// Destructure environment variables
const {
	INITIAL_SUPPLY,
	UPDATING_TOKEN_COUNT,
	IMAGE_UPDATE_DIR_PATH,
	METADATA_DIR_PATH,
	METADATA_UPDATE_DIR_PATH,
} = process.env;

// Define the main function
const main = async () => {
	try {
		console.log(`Preparing random ${UPDATING_TOKEN_COUNT} images...`);

		// Generate an array of random token IDs to update
		let tokens = [];
		let count = UPDATING_TOKEN_COUNT;
		do {
			const tokenId = Math.floor(Math.random() * INITIAL_SUPPLY);
			if (!tokens.includes(tokenId)) {
				count--;
				tokens.push(tokenId);
			}
		} while (count > 0);

		// Generate new images for the selected tokens
		for (const token of tokens) {
			await generateImage(token, IMAGE_UPDATE_DIR_PATH);
		}

		console.log(`Uploading updated images to IPFS...`);

		// Upload the updated images to IPFS and get the hash
		const IPFS_UPDATED_IMAGE_DIR_HASH = await uploadFolderToIPFS(IMAGE_UPDATE_DIR_PATH);

		if (IPFS_UPDATED_IMAGE_DIR_HASH != '') {
			console.log(`Updating metadata...`);

			// Update the metadata files with the new IPFS hash for the updated images
			await updateMetadata(
				METADATA_DIR_PATH,
				METADATA_UPDATE_DIR_PATH,
				IMAGE_UPDATE_DIR_PATH,
				IPFS_UPDATED_IMAGE_DIR_HASH
			);

			console.log(`Uploading updated metadata to IPFS...`);

			// Upload the updated metadata files to IPFS
			await uploadFolderToIPFS(METADATA_UPDATE_DIR_PATH);
		}
	} catch (error) {
		console.log('Update preparation failed :', error);
	}

	// Exit the process
	process.exit();
};

// Call the main function
main();
