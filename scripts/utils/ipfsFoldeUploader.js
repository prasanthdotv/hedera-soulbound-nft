const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Set up Infura IPFS API endpoint
const { INFURA_END_POINT, INFURA_API_KEY, INFURA_SECRET } = process.env;

const authorization = { username: INFURA_API_KEY, password: INFURA_SECRET };

// Function to pin a folder to IPFS
exports.uploadFolderToIPFS = async (dirPath) => {
	try {
		const form = new FormData();
		const files = await getFilesFromFolder(dirPath);
		for (const file of files) {
			const relativePath = path.relative(dirPath, file);
			form.append('file', fs.createReadStream(file), {
				filename: relativePath,
			});
		}
		const response = await axios.post(
			`${INFURA_END_POINT}/add?wrap-with-directory=true`,
			form,
			{
				headers: {
					...form.getHeaders(),
				},
				auth: authorization,
			}
		);
		let folderHash;
		const objects = response.data.split('\n');
		for (let obj of objects) {
			if (obj.trim() === '') continue; // Skip empty strings
			const parsedObj = JSON.parse(obj);
			if (parsedObj.Name === '') {
				folderHash = parsedObj.Hash;
				break; // Exit the loop after finding the first match
			}
		}
		console.log(`Uploaded folder to IPFS Successfully.`);
		console.log('Folder Hash :', folderHash);
		return folderHash;
	} catch (error) {
		throw new Error(`Failed to pin folder to IPFS: ${error.message}`);
	}
};

const getFilesFromFolder = async (dirPath) => {
	const files = [];
	for await (const dirEntry of fs.opendirSync(dirPath)) {
		const fullPath = path.join(dirPath, dirEntry.name);
		if (dirEntry.isFile()) {
			files.push(fullPath);
		} else if (dirEntry.isDirectory()) {
			const subFiles = await getFilesFromFolder(fullPath);
			files.push(...subFiles);
		}
	}
	return files;
};
