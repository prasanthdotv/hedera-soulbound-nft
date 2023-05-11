const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { IMAGE_DOWNLOAD_URL } = process.env;

// Define the async function to generate images
exports.generateImage = async (fileName, dirPath) => {
	try {
		// Make a GET request to the image download URL with response type 'stream'
		const response = await axios({
			method: 'get',
			url: IMAGE_DOWNLOAD_URL,
			responseType: 'stream',
		});
		// Create a write stream to save the downloaded image with filename as index/tokenId
		const file = fs.createWriteStream(`${dirPath}/${fileName}.jpg`);

		// Pipe the response data to the write stream
		response.data.pipe(file);

		// Once the write stream finishes, close the file and log a success message
		file.on('finish', () => {
			file.close();
			console.log(`Image ${fileName} downloaded successfully.`);
		});
	} catch (error) {
		// Log an error if image download fails
		console.error(`Error downloading image: ${error}`);
	}
};
