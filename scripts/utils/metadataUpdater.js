const fs = require('fs');
require('dotenv').config();

const { IPFS_UPDATED_IMAGE_DIR_HASH } = process.env;

exports.updateMetadata = async (inpDir, outDir, imgDir) => {
	try {
		const tokens = await getUpdatedTokens(imgDir);
		// Iterate over each file in the input directory
		for (const file of tokens) {
			// Read the JSON file contents
			const filePath = `${inpDir}/${file}`;
			const jsonData = await fs.promises.readFile(filePath, 'utf-8');
			const jsonObj = JSON.parse(jsonData);

			// Update the JSON object as needed
			jsonObj.image = `ipfs://${IPFS_UPDATED_IMAGE_DIR_HASH}/${file.replace(
				'.json',
				'.jpg'
			)}`;

			// Write the updated JSON object to a new file in the output directory
			const outputFilePath = `${outDir}/${file}`;
			const outputData = JSON.stringify(jsonObj, null, 2);
			await fs.promises.writeFile(outputFilePath, outputData);

			console.log(`File ${file} processed successfully.`);
		}
	} catch (error) {
		console.error(`Error processing files: ${error}`);
	}
};

const getUpdatedTokens = async (imgDir) => {
	try {
		const files = await fs.promises.readdir(imgDir);
		const fileNames = files.map((file) => file.replace('.jpg', '.json'));
		return fileNames;
	} catch (err) {
		throw new Error(`Error reading directory: ${err}`);
	}
};
