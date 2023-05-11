const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Set up Infura IPFS API endpoint
const endpoint = process.env.INFURA_END_POINT;
const projectId = process.env.INFURA_API_KEY;
const projectSecret = process.env.INFURA_SECRET;

const authorization = { username: projectId, password: projectSecret };
const folderPath = './static/images';

const main = async () => {
	await uploadImagesToIPFS();
};

// Function to pin a folder to IPFS
const uploadImagesToIPFS = async () => {
	try {
		const form = new FormData();
		const files = await getFilesFromFolder();
		for (const file of files) {
			const relativePath = path.relative(folderPath, file);
			form.append('file', fs.createReadStream(file), {
				filename: relativePath,
			});
		}
		const response = await axios.post(`${endpoint}/add?wrap-with-directory=true`, form, {
			headers: {
				...form.getHeaders(),
			},
			auth: authorization,
		});
		console.log('File Hashes :', response.data);
		console.log(`Uploaded images to IPFS Successfully.`);
	} catch (error) {
		console.error(`Failed to pin folder to IPFS: ${error.message}`);
	}
};

const getFilesFromFolder = async () => {
	const files = [];
	for await (const dirEntry of fs.opendirSync(folderPath)) {
		const fullPath = path.join(folderPath, dirEntry.name);
		if (dirEntry.isFile()) {
			files.push(fullPath);
		} else if (dirEntry.isDirectory()) {
			const subFiles = await getFilesFromFolder(fullPath);
			files.push(...subFiles);
		}
	}
	return files;
};

main();
