// Import the required modules
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Define tiers and balances
const tiers = ['Gold', 'Silver', 'Bronze'];
const balances = [10, 100];

// Define limits for each tier and balance
const tierLimits = {
	Gold: 20,
	Silver: 30,
	Bronze: 50,
};

const balanceLimits = {
	10: 50,
	100: 50,
};

// Define function to generate metadata for each token
exports.generateMetadata = async (index, fileDir, IPFS_IMAGE_DIR_HASH) => {
	// Declare variables for tier, balance and filename
	let tier, balance;
	let fileName = `${index}.json`;

	// Select a random tier until the limit for that tier is reached
	do {
		tier = tiers[Math.floor(Math.random() * tiers.length)];
	} while (tierLimits[tier] <= 0);

	// Select a random balance until the limit for that balance is reached
	do {
		balance = balances[Math.floor(Math.random() * balances.length)];
	} while (balanceLimits[balance] <= 0);

	// Decrement the limits for the selected tier and balance
	tierLimits[tier]--;
	balanceLimits[balance]--;

	// Define the content for the JSON file
	const fileContent = {
		name: `Hedera Soulbound Token ${index}`,
		creator: 'prasanthdotv',
		description: 'Lorum Ipsum',
		type: 'image/jpg',
		format: 'none',
		properties: {
			tier,
			balance,
		},
		image: `ipfs://${IPFS_IMAGE_DIR_HASH}/${index}.jpg`,
	};

	// Define the file path and write the file
	const filePath = path.join(fileDir, fileName);

	fs.mkdirSync(fileDir, { recursive: true });
	fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));

	console.log(`Created JSON file: ${fileName}`);
};
