// Importing necessary modules from utils.js file
const { generateImage, uploadFolderToIPFS, generateMetadata } = require('./utils');
// Retrieving environment variables
const { INITIAL_SUPPLY, IMAGE_DIR_PATH, METADATA_DIR_PATH } = process.env;
// Defining the main function as an asynchronous function
const main = async () => {
	try {
		// Generating random images and storing them in the image directory
		console.log(`Preparing random ${INITIAL_SUPPLY} images...`);
		for (let i = 0; i < INITIAL_SUPPLY; i++) {
			await generateImage(i, IMAGE_DIR_PATH);
		}
		// Uploading the images to IPFS
		console.log(`Uploading images to IPFS...`);
		const IPFS_IMAGE_DIR_HASH = await uploadFolderToIPFS(IMAGE_DIR_PATH);

		// Checking if the image directory hash is not empty
		if (IPFS_IMAGE_DIR_HASH != '') {
			// Generating metadata for the images and storing them in the metadata directory
			console.log(`Generating metadata...`);
			for (let i = 0; i < INITIAL_SUPPLY; i++) {
				await generateMetadata(i, METADATA_DIR_PATH, IPFS_IMAGE_DIR_HASH);
			}

			// Uploading the metadata to IPFS
			console.log(`Uploading metadata to IPFS...`);
			await uploadFolderToIPFS(METADATA_DIR_PATH);
		}
	} catch (error) {
		console.log('Initial setup failed :', error);
	}
	// Exiting the process
	process.exit();
};

// Calling the main function
main();
