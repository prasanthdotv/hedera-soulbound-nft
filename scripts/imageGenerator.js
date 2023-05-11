const axios = require('axios');
const fs = require('fs');

const url = 'https://picsum.photos/700'; // replace with your image URL
const filePath = `./static/images`; // replace with the file path where you want to save the image

const main = async () => {
	await generateImages(100);
};

const generateImages = async (count) => {
	try {
		for (let i = 100; i < 101; i++) {
			const response = await axios({
				method: 'get',
				url: url,
				responseType: 'stream',
			});
			const file = fs.createWriteStream(`${filePath}/${i}.jpg`);
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
