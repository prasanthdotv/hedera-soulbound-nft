const { generateImage, uploadFolderToIPFS, generateMetadata } = require('./utils');

const { INITIAL_SUPPLY, IMAGE_DIR_PATH, METADATA_DIR_PATH } = process.env;

const main = async () => {
	console.log(`Preparing random ${INITIAL_SUPPLY} images...`);
	for (let i = 1; i <= INITIAL_SUPPLY; i++) {
		await generateImage(i, IMAGE_DIR_PATH);
	}

	console.log(`Uploading images to IPFS...`);
	await uploadFolderToIPFS(IMAGE_DIR_PATH);

	console.log(`Generating metadata...`);
	for (let i = 1; i <= INITIAL_SUPPLY; i++) {
		await generateMetadata(i, METADATA_DIR_PATH);
	}

	console.log(`Uploading metadata to IPFS...`);
	await uploadFolderToIPFS(METADATA_DIR_PATH);
};

main();
