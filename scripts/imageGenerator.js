const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { INITIAL_SUPPLY, IMAGE_DOWNLOAD_URL, IMAGE_DIR_PATH } = process.env;

const main = async () => {
	await generateImages(100);
};

const generateImages = async (count) => {
	try {
		for (let i = 1; i <= INITIAL_SUPPLY; i++) {
			const response = await axios({
				method: 'get',
				url: IMAGE_DOWNLOAD_URL,
				responseType: 'stream',
			});
			const file = fs.createWriteStream(`${IMAGE_DIR_PATH}/${i}.jpg`);
			response.data.pipe(file);

			file.on('finish', () => {
				file.close();
				console.log(`Image ${i} downloaded successfully.`);
			});
		}
	} catch (error) {
		console.error(`Error downloading image: ${error}`);
	}
};

main();
